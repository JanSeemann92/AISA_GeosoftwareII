# Title: runDemo
# Author: Liliana Gitschel, Jan Seemann
# Latest Update: 18.01.2022
# 
# Purpose:
#   Includes functions for necessary calculations within the AISA tool:
#   training of model, making predictions, estimate the AOA, suggesting new sample locations
#   exposes a function that runs the demo as API
#
############################################################################################
############################################################################################

# Prepare environment:

# delete all variables from environment
rm(list=ls())

# load packages for training
library(raster)
library(sf)
library(caret)
# load packages for AOA
library(CAST)
library(doParallel) # loads dependencies too
# load packages for API
library(beakr)
library(rgdal)
# load packages for exporting geojson and JSON
library(geojson)
library(RJSONIO)

# set working directory: directory which includes needed data
#### needs to be changed later on to the hosting server
setwd("C:/Users/katha/Documents/GitHub/AISA_GeosoftwareII/Backend/demodata/")


#######################################################################
# Name of function: TrainModel
# Author: Liliana Gitschel
# Latest Update: 18.01.2022
# 
# Purpose:
#   Train a model when no model is given by the user.
#
# Input:
#   trainingsites - GeoPackage containing labelled training polygons (User Input), important: lables must be named "label"!!
#   sentinel_resampled - grd-data containing the readily resampled sentinel-2-image from AWS
#
# Output:
#   model - Trained model
#
# Reference:
#   Partly based on: https://github.com/HannaMeyer/OpenGeoHub_2021
#
########################################################################

TrainModel <- function (trainingsites, sentinel_resampled) {
  
  # Extract only those pixels from the combined sentinel data, that are within the training polygons
  extr <- extract(sentinel_resampled, trainingsites, df=TRUE)
  
  # Add information of labels of polygons to data
  trainingsites$PolyID <- 1:nrow(trainingsites)
  extr <- merge(extr, trainingsites, by.x="ID", by.y
                ="PolyID")
  
  # set predictors (whole data from raster stack)
  predictors <- names(sentinel_resampled)
  
  # limit data
  # Proportion of data from each training polygon should be kept
  # here:10% of each training polygon (see ?createDataPartition)
  trainIDs <- createDataPartition(extr$ID,p=0.1,list = FALSE)
  trainDat <- extr[trainIDs,]
  
  # Make sure no NA is given in predictors:
  trainDat <- trainDat[complete.cases(trainDat[,predictors]),]
  
  # train model with random forest and no tuning
  # model_simple <- train(trainDat[,predictors],
  #                      trainDat$label,
  #                      method="rf",
  #                      importance=TRUE,
  #                      ntree=50) # 50 is quite small (default=500). But it runs faster.
  
  # create spatial folds for cross validation; here k=3 folds
  trainids <- CreateSpacetimeFolds(trainDat,spacevar="ID",class="label",k=3)

  # train model with random forest and  tuning using cross validation and kappa
  model <- train(trainDat[,predictors],
                 trainDat$label,
                 method="rf",
                 importance=TRUE,
                 metric="Kappa", # Optimaler mtry Wert über Kappa
                 tunelength=length(predictors),
                 ntree=200, # 50 is quite small (default=500). But it runs faster.
                 trControl=trainControl(method="cv",index=trainids$index,savePredictions="all"))

  print("model trained")
  return(model)
}





#######################################################################
# Title: AOA
# Author: Liliana Gitschel
# Latest Update: 18.01.2022
# 
# Purpose:
#   Estimate the AOA.
#
# Input:
#   sentinel_combined - grd-data containing the readily resampled sentinel-2-image from AWS
#   model - Trained model in RDS-data format
#           (either uploaded by user or internally created with function TrainModel)
#
# Output:
#   AOA - Estimation of AOA (Rasterstack)
#
# Reference:
#   Partly based on: https://github.com/HannaMeyer/OpenGeoHub_2021
#
########################################################################

AOA <- function (sentinel_resampled, model) {
  
  # Estimate AOA
  cl <- makeCluster(detectCores()-1) # devide data into (number of CPU cores)-1 clusters
  registerDoParallel(cl)  # calculate clusters in parallel to speed up the process
  AOA <- aoa(sentinel_resampled,model,cl=cl)  # estimate AOA

  print("AOA calculated")
  return(AOA)
}



#######################################################################
# Title: NewSamplingLocations
# Author: Liliana Gitschel
# Latest Update: 20.12.2021
# 
# Purpose:
#   Suggest new sampling locations based on the areas outside the AOA.
#
# Input:
#   AOA - AOA
#
# Output:
#   samples_geojson - GeoJson containing points for new sampling locations.
#
########################################################################

NewSamplingLocations <- function(AOA) {
  
  # extract layer containing AOA from raster stack
  AOA_only <- raster(AOA, layer=2)
  
  # set values inside AOA (=1) to NA
  AOA_only_outside <- reclassify(AOA_only, cbind(1, NA))
  
  # get new sampling locations (method = random)
  samples <- sampleRandom(AOA_only_outside, size=50, sp=TRUE)
  
  # convert sampling locations to geojson
  samples_geojson <- as.geojson(samples)
  
  return(samples_geojson)
}



############################################################
# Workflow uses above defined funtions


# Create and start the beakr instance
newBeakr() %>%
  # Host the directory of static files
  
# Create and start the beakr instance
newBeakr() %>%
  
  cors() %>%
  
  #POST API withModel
  httpPOST(path = '/withModel', function(req,res,err) {
    
    
    #testing
    print(req$parameters$lat1)
    print(req$parameters$long1)
    print(req$parameters$lat2)
    print(req$parameters$long2)
    print(req$parameters$cov)
    print(req$parameters$reso)
    
    # load input data
    # As predictor variables a raster data set with sentinel-2 data is used.
    # The data comes form AWS and is preprocessed internally first.
    # load and build stack with data for area of interest (=sentinel-2 images for prediction)
    sentinel_combined_prediction <- stack("sentinel/sentinel_prediction.grd")  #replace stac file here!
    # load model
    ### option for GeoJSON needs to be added!
    model <- readRDS("upload/model.RDS")   #replace user input file here
    
    # no reprojection needed
    # sentinel images from AWS/stac already come in EPSG4326 which is needed for leaflet
    
    # do calculations
    predictionLULC <- predict(sentinel_combined_prediction, model)
    areaOA <- AOA (sentinel_combined_prediction,model)
    samplingLocations <- NewSamplingLocations(areaOA)
    
    # get labels of LULC (needed for legend on map)
    label <- c(model$levels)
    # add type of workflow
    label <- c("model", label)
    # convert to json for export
    labelsJSON <- toJSON(label)
    
    #writing output files
    writeRaster(predictionLULC, "createdbyAISAtool/predictionOutput.tif", overwrite=T)
    print("LULC output file written")
    writeRaster(areaOA, "createdbyAISAtool/aoaOutput.tif", overwrite=T)
    print("AOA output file written")
    write(samplingLocations, "createdbyAISAtool/samplingLocationsOutput.geojson")
    print("New sampling locations output geojson written")
    write(labelsJSON, "createdbyAISAtool/labelsOutput.json")
    print("Labels output json written")
    
    res$setHeader("Access-Control-Allow-Origin", "*")
    return("JobDone")
  }) %>%
  
  
  #POST API noModel
  httpPOST(path = '/noModel', function(req,res,err) {
    
    
    #testing
    print(req$parameters$lat1)
    print(req$parameters$long1)
    print(req$parameters$lat2)
    print(req$parameters$long2)
    print(req$parameters$cov)
    print(req$parameters$reso)
    
    
    # load input data
    # As predictor variables a raster data set with sentinel-2 data is used.
    # The data comes form AWS and is preprocessed internally first.
    # load and build stack with data of predictor variables (=sentinel-2 images for training)
    # load and build stack with data for area of interest (=sentinel-2 images for prediction)
    sentinel_combined_training <- stack("sentinel/sentinel_training.grd")  # eventually not needed
    sentinel_combined_prediction <- stack("sentinel/sentinel_prediction.grd")  # eventually not needed
    # load training polygons
    ### option for GeoJSON needs to be added!
    trainingsites <- st_read("upload/trainingdata.gpkg")   #replace user input file here
    
    # reproject crs of input data to EPSG4326
    # sentinel images from AWS/stac already come in EPSG4326
    # ensures that data has same crs and that it can be displayed by leaflet
    # for reference see: https://spatialreference.org/ref/sr-org/6627/
    trainingsites <- st_transform(trainingsites, crs = "+proj=longlat +datum=WGS84 +no_defs")
    
    
    # do calculations
    model <-TrainModel(trainingsites, sentinel_combined_training)
    predictionLULC <- predict(sentinel_combined_prediction, model)
    areaOA <- AOA (sentinel_combined_prediction,model)
    samplingLocations <- NewSamplingLocations(areaOA)
    
    # get labels of LULC (needed for legend on map)
    label <- c(model$levels)
    # add type of workflow
    label <- c("trainingdata", label)
    # convert to json for export
    labelsJSON <- toJSON(label)
    
    #writing output files
    saveRDS(model,file="createdbyAISAtool/modelOutput.RDS")
    print("model output file written")
    writeRaster(predictionLULC, "createdbyAISAtool/predictionOutput.tif", overwrite=T)
    print("LULC output file written")
    writeRaster(areaOA, "createdbyAISAtool/aoaOutput.tif", overwrite=T)
    print("AOA output file written")
    st_write(trainingsites, "createdbyAISAtool/trainingsitesOutput.geojson",  delete_dsn = TRUE)
    print("trainingsites geojson output written")
    write(samplingLocations, "createdbyAISAtool/samplingLocationsOutput.geojson")
    print("New sampling locations output geojson written")
    write(labelsJSON, "createdbyAISAtool/labelsOutput.json")
    print("Labels output json written")
    
    
    res$setHeader("Access-Control-Allow-Origin", "*")
    return("JobDone")
  }) %>%
  
  
  
  #GET API runDemo
   httpGET(path = '/runDemo', function(req,res,err) {
    # load input data
    # As predictor variables a raster data set with sentinel-2 data is used.
    # The data either comes form AWS and is preprocessed internally first or the demodata is used.
    # load and build stack with data of predictor variables (=sentinel-2 images)
    ### yet only running with demodata!
    sentinel_combined <- stack("demo/demodata_rheine_sentinel_combined.grd")
    # load training polygons
    ### option for GeoJSON needs to be added!
    trainingsites <- st_read("demo/demodata_rheine_trainingspolygone.gpkg")
    
    # reproject crs of input data to EPSG4326
    # ensures that data has same crs and that it can be displayed by leaflet
    # for reference see: https://spatialreference.org/ref/sr-org/6627/
    trainingsites <- st_transform(trainingsites, crs = "+proj=longlat +datum=WGS84 +no_defs")
    sentinel_combined <- projectRaster(sentinel_combined,crs=crs(trainingsites))
    
    # do calculations
    model <-TrainModel(trainingsites, sentinel_combined)
    predictionLULC <- predict(sentinel_combined,model)
    areaOA <- AOA (sentinel_combined,model)
    samplingLocations <- NewSamplingLocations(areaOA)
    
    # get labels of LULC (needed for legend on map)
    label <- c(model$levels)
    # add type of workflow
    label <- c("demo", label)
    # convert to json for export
    labelsJSON <- toJSON(label)
    
    #writing output files
    saveRDS(model,file="createdbyAISAtool/modelOutput.RDS")
    print("model output file written")
    writeRaster(predictionLULC, "createdbyAISAtool/predictionOutput.tif", overwrite=T)
    print("LULC output file written")
    writeRaster(areaOA, "createdbyAISAtool/aoaOutput.tif", overwrite=T)
    print("AOA output file written")
    st_write(trainingsites, "createdbyAISAtool/trainingsitesOutput.geojson",  delete_dsn = TRUE)
    print("trainingsites geojson output written")
    write(samplingLocations, "createdbyAISAtool/samplingLocationsOutput.geojson")
    print("New sampling locations output geojson written")
    write(labelsJSON, "createdbyAISAtool/labelsOutput.json")
    print("Labels output json written")
    
    
    res$setHeader("Access-Control-Allow-Origin", "*")
    return("JobDone")
    }) %>%
  
  # Host the directory of static files  
  serveStaticFiles("/verzeichnisdemodaten", "C:/Users/katha/Documents/GitHub/AISA_GeosoftwareII/Backend/demodata/createdbyAISAtool/", verbose = TRUE) %>%

  
  handleErrors() %>%
  
  listen(host = "127.0.0.1", port = 25118) #for local testing
#listen(host = "44.234.41.163", port =  8780) #for AWS






# URL GET API Call for local testing: http://127.0.0.1:25118/runDemo
# URL GET API Call for AWS: http://44.234.41.163:8780/runDemo


# URL POST API Call for local testing  http://127.0.0.1:25118/withModel?lat1=20&long1=100&lat2=30&long2=105&cov=0.3&reso=600  (the numbers are example values)
# URL POST API Call for local testing  http://127.0.0.1:25118/noModel?lat1=20&long1=100&lat2=30&long2=105&cov=0.3&reso=600  (the numbers are example values)




# URL GET API Call for local testing: http://127.0.0.1:25118/runDemo
# URL GET API Call for AWS: http://44.234.41.163:8780/runDemo