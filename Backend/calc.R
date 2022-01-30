
# Title: runDemo
# Author: Liliana Gitschel, Jan Seemann, Niklas Daute
# Latest Update: 21.01.2022
# 
# Purpose:
#   Includes functions for necessary calculations within the AISA tool:
#   generating images from AWS, training of model, making predictions, estimate the AOA, suggesting new sample locations
#   Implements APIs for different workflows (demo, with model, with trainingdata)
#
############################################################################################
############################################################################################
print("R Skript ist da")
# Prepare environment:

# delete all variables from environment
rm(list=ls())

# load packages for training and AOA
library(raster)
library(sf)
library(caret)
library(CAST)
library(doParallel) # loads dependencies too
  # load packages for API
library(beakr)
library(rgdal)
  # load packages for exporting geojson and JSON
library(geojson)
library(RJSONIO)
  # load packages for image generation from AWS
library(rstac) 
library(gdalcubes)
  # library(stars)
  # library(magick)
  # library(rmarkdown) 
  # library(ncdf4)
  # library(Rcpp)
  # library(jsonlite)
  # library(RcppProgress)
  # library(tmap)

#getwd()
#setwd("/R")
#getwd()
# set working directory: directory which includes needed data
#### needs to be changed later on to the hosting server
#setwd("/home/ubuntu/AISA_GeosoftwareII/Backend")
  #setwd("C:/Users/katha/Documents/GitHub/AISA_GeosoftwareII/Backend/")
  #setwd("D:/Studium/Geosoftware1/AISA_GeosoftwareII/Backend/")
  #setwd("C:/Users/lgits/Documents/GitHub/AISA_GeosoftwareII/Backend/")

#######################################################################

# define functions:

########################################################################
# Name of function: generateImage
# Author: Niklas Daute
# Latest Update: 20.01.2022
# 
# Purpose:
#   Generate sentinel-2-images for a given bounding box from AWS using stac.
#
# Input:
#   cloudcover - maximum percentage of cloudcover for filtering the sentinel-2-images
#   resolution - resolution in which the images should be generated
#   left - left longitude value for bounding box (given in EPSG 4326)
#   right - right longitude value for bounding box (given in EPSG 4326)
#   top - upper latitude value for bounding box (given in EPSG 4326)
#   bottom - lower latitude value for bounding box (given in EPSG 4326)
#   type - indicates whether the image is for training or prediction purposes
#
# Output:
#   writes image as geotif in directory
#
########################################################################

generateImage <- function (cloudcover, resolution, left, right, top, bottom, type){
  
  # set filename depending on type
  # type can be "prediction" or "training"
  filename <- "sentinel"
  
  if (type == "prediction"){
    filename <- "sentinel_prediction"
  } else {
    filename <- "sentinel_training"
  }
  
  
  # STAC catalog
  s <- stac("https://earth-search.aws.element84.com/v0")
  
  
  # query STAC
  items <- s %>%
    stac_search(collections = "sentinel-s2-l2a-cogs",
                bbox = c(left,top,right,bottom), # Geneva
                datetime = "2020-01-01/2020-12-31",
                limit = 500) %>%
    post_request() 
  
  
  # filter by cloud cover
  system.time(col <- stac_image_collection(items$features,
                                           property_filter = function(x)
                                           {x[["eo:cloud_cover"]] < cloudcover}))
  
  
  # create cubeview
  v = cube_view(srs = "EPSG:4326",
                extent = list(t0 = "2020-01-01",
                              t1 = "2020-12-31",
                              left = left,
                              right = right,
                              top = top,
                              bottom = bottom),
                dx = 0.001,
                dy = 0.0001,
                dt = "P1D",
                aggregation = "median",
                resampling = "near")

  
  # create datacube and output
  S2.mask = image_mask("SCL", values=c(3,8,9)) # clouds and cloud shadows
  gdalcubes_options(threads = 4) 
  raster_cube(col, v) %>%
    select_bands(c("B02",
                   "B03",
                   "B04",
                   "B05",
                   "B06",
                   "B07",
                   "B08",
                   "B11",
                   "B12",
                   "B8A")) %>%
    reduce_time(c("median(B02)",
                  "median(B03)",
                  "median(B04)",
                  "median(B05)",
                  "median(B06)",
                  "median(B07)",
                  "median(B08)",
                  "median(B11)",
                  "median(B12)",
                  "median(B8A)")) %>%
    write_tif(dir="/home/ubuntu/AISA_GeosoftwareII/Backend/data/sentinel", prefix = filename) %>%     # set correct directory
    # plot(rgb = 3:1, zlim=c(0,1800)) %>%
    # system.time()
    
    return()
}


  print("test Mitte")


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
#   sentinel_resampled - geotif or grd-data containing the readily resampled sentinel-2-image from AWS
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
  #                      trainDat$Label,
  #                      method="rf",
  #                      importance=TRUE,
  #                      ntree=50) # 50 is quite small (default=500). But it runs faster.
  
  # create spatial folds for cross validation; here k=3 folds
  trainids <- CreateSpacetimeFolds(trainDat,spacevar="ID",class="Label",k=3)
  
  # train model with random forest and  tuning using cross validation and kappa
  model <- train(trainDat[,predictors],
                 trainDat$Label,
                 method="rf",
                 importance=TRUE,
                 metric="Kappa", # Optimaler mtry Wert �ber Kappa
                 tunelength=length(predictors),
                 ntree=200, # 50 is quite small (default=500). But it runs faster.
                 trControl=trainControl(method="cv",index=trainids$index,savePredictions="all"))
  
  print("model trained")
  return(model)
}





#######################################################################
# Title: AOA
# Author: Liliana Gitschel
# Latest Update: 21.01.2022
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
#   AOA_only - Estimation of AOA (Rasterstack) without DI
#
# Reference:
#   Partly based on: https://github.com/HannaMeyer/OpenGeoHub_2021
#
########################################################################

AOA <- function (sentinel_resampled, model) {
  
  # Estimate AOA
  cl <- makeCluster(4) # devide data into 4 clusters
  registerDoParallel(cl)  # calculate clusters in parallel to speed up the process
  AOA <- aoa(sentinel_resampled,model,cl=cl)  # estimate AOA
  
  # extract layer containing AOA from raster stack (without DI)
  AOA_only <- raster(AOA, layer=2)
  
  print("AOA calculated")
  return(AOA_only)
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
#   AOA - AOA (without DI)
#
# Output:
#   samples_geojson - GeoJson containing points for new sampling locations.
#
########################################################################

NewSamplingLocations <- function(areaOA) {
  print("start sampling")
  AOA_only_outside <- reclassify(areaOA, cbind(1, NA))
  print("reduced to aoa_outside")
  # get new sampling locations (method = random)
  samples <- sampleRandom(AOA_only_outside, size=50, sp=TRUE)
  print("random samples calculated")
  # convert sampling locations to geojson
  samples_geojson <- as.geojson(samples)
  print("new sampling locations calculated")
  return(samples_geojson)
}

print("zeile296")


#######################################################################
# Title: checkTrainData
# Author: Liliana Gitschel
# Latest Update: 27.01.2022
# 
# Purpose:
#   Checks if requirements on trainingsites input are valid
#
# Input:
#   trainData - trainingsites
#
# Output:
#   boolean (TRUE for valid)
#
########################################################################

checkTrainData <- function(trainData) {
  # check if data has property "Label" and "Label" is not empty
  if (length(trainData$Label) <= 0) {
    return(FALSE)
  }
  # check if data has CRS
  else if (is.na(crs(trainData))) {
    return(FALSE)
  } 
  else {
    # check if at least 2 entries per Label
    counts <- as.data.frame(table(trainData$Label))
    for (i in 1:(length(counts$Freq))) {
      if (counts$Freq[i] < 2) {
        return(FALSE)
      }
    }
  }
  return (TRUE)
}


#######################################################################
# Title: checkModel
# Author: Liliana Gitschel
# Latest Update: 27.01.2022
# 
# Purpose:
#   Checks if requirements on model input are valid
#
# Input:
#   model - model
#
# Output:
#   checked - boolean (TRUE for valid)
#
########################################################################

checkModel <- function(model) {
  # check if there are any predictor names
  modelnames <- model$finalModel$xNames
  if (length(modelnames) == 0) {
    return(FALSE)
  }
  # check if model only contains allowed predictor names
  bandnames <- c("B02","B03","B04","B05","B06","B07","B08","B11","B12","B8A")
  MnamesNotInBnames <- subset(modelnames, !(modelnames %in% bandnames))
  if (length(MnamesNotInBnames) > 0) {
    return (FALSE)
  }
  return(TRUE)
}



############################################################
############################################################
#
# Authors: Jan Seemann, Liliana Gitschel
# Latest update: 21.01.22
#
# Purpose:
#   Implements connection to frontend via beakr instance and
#   workflows for following options: demo, with model, with training data.
#   Workflows use above defined functions
#
###########################################################


# Create and start the beakr instance
newBeakr() %>%
  # Host the directory of static files
  

  
  cors(
  path = NULL,
  methods = c("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"),
  origin = "*",
  credentials = NULL,
  headers = NULL,
  maxAge = NULL,
  expose = NULL
  ) %>%
  
  
  ########################################
#POST API withModel
httpPOST(path = '/withModel', function(req,res,err) {
  
  output_string <- "JobDone"

  # load model
  model <- readRDS("data/upload/upload.rds")

  # check for correct requirements on input data
  if (checkModel(model) == TRUE) {
    output_string <- "ok"
    print(output_string)
    # return((output_string))
  } else {
    output_string <- "invalid model"
    print(output_string)
    return(output_string) # abort calculation
  }

  #testing
  print(req$parameters$lat1)
  print(req$parameters$long1)
  print(req$parameters$lat2)
  print(req$parameters$long2)
  print(req$parameters$cov)
  print(req$parameters$reso)
  
  # parameters for AOI
  top <- as.numeric(req$parameters$lat1)
  left <- as.numeric(req$parameters$long1)
  bottom <- as.numeric(req$parameters$lat2)
  right <- as.numeric(req$parameters$long2)
  cov <- as.numeric(req$parameters$cov)
  reso <- as.numeric(req$parameters$reso)
  type <- "prediction"
  
  
  # generate sentinel images from AWS for AOI/prediction
  generateImage(cov, reso, left, right, top, bottom, type)
  
  
  
  # As predictor variables a raster data set with sentinel-2 data is used.
  # The data comes form AWS and is preprocessed internally first (see above).
  # load and build stack with data for area of interest (=sentinel-2 images for prediction)
  sentinel_combined_prediction <- stack("data/sentinel/sentinel_prediction2020-01-01.tif")
  # no reprojection needed
  # sentinel images from AWS/stac already come in EPSG4326 which is needed for leaflet
  
  # set names of bands in the sentinel data
  bandnames <- c("B02","B03","B04","B05","B06","B07","B08","B11","B12","B8A")
  names(sentinel_combined_prediction) <- bandnames
  
  # do calculations
  predictionLULC <- predict(sentinel_combined_prediction, model)
  areaOA <- AOA (sentinel_combined_prediction,model)
  
  
  #calcualting and writing sampling locations
  
  if(0 %in% values(areaOA)){
    samplingLocations <- NewSamplingLocations(areaOA)
    write(samplingLocations, "data/output/samplingLocationsOutput.geojson")
    print("New sampling locations output geojson written")
    sampling <- "sampling"
  } else {print ("AOA = AOI")
    sampling <- "nosampling"
    output_string <- "No Sampling Locations"
  }
  
  # get labels of LULC (needed for legend on map)
  label <- c(model$levels)
  # add type of workflow
  label <- c("model",sampling , label)
  print("labels extracted")
  # convert to json for export
  labelsJSON <- toJSON(label)
  
  #writing output files
  writeRaster(predictionLULC, "data/output/predictionOutput.tif", overwrite=T)
  print("LULC output file written")
  writeRaster(areaOA, "data/output/aoaOutput.tif", overwrite=T)
  print("AOA output file written")
  
  write(labelsJSON, "data/output/labelsOutput.json")
  print("Labels output json written")
  
  res$setHeader("Access-Control-Allow-Origin", "*")
  return(output_string)
}) %>%
  
  
  ########################################
#POST API noModel
httpPOST(path = '/noModel', function(req,res,err) {
  output_string <- "JobDone"
  
  # load training data
  # depends on data format (gpkg or geojson)
  dataformat <- req$parameters$format   # variables names must be checked with frontend
  if (dataformat == "geopackage") {
    trainingsites <- st_read("data/upload/upload.gpkg")
  } else {
    trainingsites <- st_read("data/upload/upload.geojson")
  }

  # check for correct requirements on input data
    if (checkTrainData(trainingsites) == TRUE) {
      output_string <- "ok"
      print(output_string)
      # return((output_string))
    } else {
      output_string <- "invalid trainingdata"
      print(output_string)
      return(output_string) # abort calculation
    }

  # reproject crs of input data to EPSG4326
  # sentinel images from AWS/stac already come in EPSG4326
  # ensures that data has same crs and that it can be displayed by leaflet
  # for reference see: https://spatialreference.org/ref/sr-org/6627/
  trainingsites <- st_transform(trainingsites, crs = "+proj=longlat +datum=WGS84 +no_defs")

  #testing
  print(req$parameters$lat1)
  print(req$parameters$long1)
  print(req$parameters$lat2)
  print(req$parameters$long2)
  print(req$parameters$cov)
  print(req$parameters$reso)
  
  # parameters for training
  right <- st_bbox(trainingsites)[3]    #xmax
  bottom <- st_bbox(trainingsites)[2]   #ymin
  left <- st_bbox(trainingsites)[1]  #xmin
  top <- st_bbox(trainingsites)[4]   #ymax 
  cov <- as.numeric(req$parameters$cov)
  reso <- as.numeric(req$parameters$reso)
  type <- "training"

  # return(output_string)

  # generate sentinel images from AWS for training
  generateImage(cov, reso, left, right, top, bottom, type)
  
  # parameters for AOI
  top <- as.numeric(req$parameters$lat1)
  left <- as.numeric(req$parameters$long1)
  bottom <- as.numeric(req$parameters$lat2)
  right <- as.numeric(req$parameters$long2)
  cov <- as.numeric(req$parameters$cov)
  reso <- as.numeric(req$parameters$reso)
  type <- "prediction"
  
  # generate sentinel images from AWS for AOI/prediction
  generateImage(cov, reso, left, right, top, bottom, type)

  # load input data
  # As predictor variables a raster data set with sentinel-2 data is used.
  # The data comes form AWS and is preprocessed internally first.
  # load generated sentinel data for training and prediction from directory
  # load and build stack with data of predictor variables (=sentinel-2 images for training)
  # load and build stack with data for area of interest (=sentinel-2 images for prediction)
  sentinel_combined_training <- stack("data/sentinel/sentinel_training2020-01-01.tif")  # eventually not needed
  sentinel_combined_prediction <- stack("data/sentinel/sentinel_prediction2020-01-01.tif")  # eventually not needed
  # no reprojection needed
  # sentinel images from AWS/stac already come in EPSG4326 which is needed for leaflet

  # set names of bands in the sentinel data
  bandnames <- c("B02","B03","B04","B05","B06","B07","B08","B11","B12","B8A")
  names(sentinel_combined_training) <- bandnames
  names(sentinel_combined_prediction) <- bandnames
  
  
  # do calculations
  model <-TrainModel(trainingsites, sentinel_combined_training)
  predictionLULC <- predict(sentinel_combined_prediction, model)
  areaOA <- AOA (sentinel_combined_prediction,model)
  
  
  #calcualting and writing sampling locations
  
  
  if(0 %in% values(areaOA)){
    samplingLocations <- NewSamplingLocations(areaOA)
    sampling <- "sampling"
    write(samplingLocations, "data/output/samplingLocationsOutput.geojson")
    print("New sampling locations output geojson written")
  } else {print("AOA=AOI") 
    sampling <- "nosampling"
    output_string <- "No Sampling Locations"
  }
  
  
  # get labels of LULC (needed for legend on map)
  label <- c(model$levels)
  # add type of workflow
  label <- c("trainingdata", sampling, label)
  print("labels extracted")
  # convert to json for export
  labelsJSON <- toJSON(label)
  
  #writing output files
  saveRDS(model,file="data/output/modelOutput.RDS")
  print("model output file written")
  writeRaster(predictionLULC, "data/output/predictionOutput.tif", overwrite=T)
  print("LULC output file written")
  writeRaster(areaOA, "data/output/aoaOutput.tif", overwrite=T)
  print("AOA output file written")
  st_write(trainingsites, "data/output/trainingsitesOutput.geojson",  delete_dsn = TRUE)
  print("trainingsites geojson output written")
  
  write(labelsJSON, "data/output/labelsOutput.json")
  print("Labels output json written")
  
  
  res$setHeader("Access-Control-Allow-Origin", "*")
  return(output_string)
}) %>%
  
  

  ########################################
#GET API runDemo
httpGET(path = '/runDemo', function(req,res,err) {
  # load input data
  # The data is kept in directory for demodata.
  # As predictor variables a raster data set with sentinel-2 data is used.
  # load and build stack with data of predictor variables (=sentinel-2 images)
  sentinel_combined <- stack("demodata/demodata_rheine_sentinel_combined.grd")
  # load training polygons
  trainingsites <- st_read("demodata/demodata_rheine_trainingspolygone.gpkg")
  
  # reproject crs of input data to EPSG4326
  # ensures that data has same crs and that it can be displayed by leaflet
  # for reference see: https://spatialreference.org/ref/sr-org/6627/
  trainingsites <- st_transform(trainingsites, crs = "+proj=longlat +datum=WGS84 +no_defs")
  sentinel_combined <- projectRaster(sentinel_combined,crs=crs(trainingsites))
 
   # rename "label" to "Label"
  names(trainingsites)[2] <- 'Label'
  
  # do calculations
  model <-TrainModel(trainingsites, sentinel_combined)
  predictionLULC <- predict(sentinel_combined,model)
  areaAOA <- AOA (sentinel_combined,model)
  samplingLocations <- NewSamplingLocations(areaAOA)
  
  # get labels of LULC (needed for legend on map)
  label <- c(model$levels)
  # add type of workflow
  label <- c("demo", label)
  # convert to json for export
  labelsJSON <- toJSON(label)
  
  #writing output files
  saveRDS(model,file="demodata/createdbyAISAtool/modelOutput.RDS")
  print("mtputdel output file written")
  writeRaster(predictionLULC, "demodata/createdbyAISAtool/predictionOutput.tif", overwrite=T)
  print("LULC output file written")
  writeRaster(areaAOA, "demodata/createdbyAISAtool/aoaOutput.tif", overwrite=T)
  print("AOA output file written")
  st_write(trainingsites, "demodata/createdbyAISAtool/trainingsitesOutput.geojson",  delete_dsn = TRUE)
  print("trainingsites geojson output written")
  write(samplingLocations, "demodata/createdbyAISAtool/samplingLocationsOutput.geojson")
  print("New sampling locations output geojson written")
  write(labelsJSON, "demodata/createdbyAISAtool/labelsOutput.json")
  print("Labels output json written")
  
  
  res$setHeader("Access-Control-Allow-Origin", "*")
  return("JobDone")
}) %>%
  
  
  ########################################
# Host the directory of static files  
#serveStaticFiles("/verzeichnisdemodaten", "C:/Users/lgits/Documents/GitHub/AISA_GeosoftwareII/Backend/", verbose = TRUE) %>%
#serveStaticFiles("/verzeichnisdemodaten", "D:/Studium/Geosoftware1/AISA_GeosoftwareII/Backend/", verbose = TRUE) %>%
#serveStaticFiles("/verzeichnisdemodaten", "/home/ubuntu/AISA_GeosoftwareII/Backend/", verbose = TRUE) %>%
  
  handleErrors() %>%

#print("Ende")

listen(host = "172.16.238.10", port = 8782) #for local testing
#listen(host = "44.234.41.163", port =  8782) #for AWS


#print("listening at port 8782")



# URL GET API Call for local testing: http://127.0.0.1:25118/runDemo
# URL GET API Call for AWS: http://44.234.41.163:8780/runDemo


# URL POST API Call for local testing  http://127.0.0.1:25118/withModel?lat1=20&long1=100&lat2=30&long2=105&cov=0.3&reso=600  (the numbers are example values)
# URL POST API Call for local testing  http://127.0.0.1:25118/noModel?lat1=20&long1=100&lat2=30&long2=105&cov=0.3&reso=600  (the numbers are example values)




# URL GET API Call for local testing: http://127.0.0.1:25118/runDemo
# URL GET API Call for AWS: http://44.234.41.163:8780/runDemo

