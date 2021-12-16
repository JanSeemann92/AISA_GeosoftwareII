# Title: Script_MainCalculations
# Author: Liliana Gitschel, Jan Seemann
# Latest Update: 16.12.2021
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
#loadpackages for API
library(beakr)

# set working directory: directory which includes needed data
#### needs to be changed later on to the hosting server
setwd("C:/Users/lgits/sciebo/Uni_Geoinfo/GI7_GeosoftwareII/ProjectAISA/AISA_GeosoftwareII/BackendDevelopmentLiliana/demodata")



#######################################################################
# Name of function: TrainModel
# Author: Liliana Gitschel
# Latest Update: 14.12.2021
# 
# Purpose:
#   Train a model when no model is given by the user.
#
# Input:
#   trainingsites - GeoPackage containing labelled training polygons (User Input), important: lables must be named "label"!!
#   sentinel_resampled - grd-data containing the readily resampled sentinel-2-image from AWS
#
# Output:
#   model - Trained model (RDS data format)
#
# Reference:
#   Partly based on: https://github.com/HannaMeyer/OpenGeoHub_2021
#
########################################################################

TrainModel <- function (trainingsites, sentinel_resampled) {
  
  # Create raster stack object
  #sentinel_resampled <- stack(sentinel_resampled)
  # Read features from trainingsites
  #trainingsites <- st_read(trainingsites)
  
  # Extract only those pixels from the combined sentinel data, that are within the training polygons
  extr <- extract(sentinel_resampled, trainingsites, df=TRUE)
  ## head(extr)
  
  # Add information of labels of polygons to data
  trainingsites$PolyID <- 1:nrow(trainingsites)
  extr <- merge(extr, trainingsites, by.x="ID", by.y
                ="PolyID")
  ## head(extr)
  
  # Save/export the training data -> not required
  # saveRDS(extr, file="createdbyAISAtool/trainData.RDS")
  
  # set predictors (whole data from raster stack) and response (label for LULC)
  predictors <- names(sentinel_resampled)
  response <- "label"
  
  ### limit data? 
  # Proportion of data from each training polygon should be kept
  # here:10% of each training polygon (see ?createDataPartition)
  trainIDs <- createDataPartition(extr$ID,p=0.1,list = FALSE)
  trainDat <- extr[trainIDs,]
  
  # Make sure no NA is given in predictors:
  trainDat <- trainDat[complete.cases(trainDat[,predictors]),]
  
  # Train model with random forest (rf)
  model <- train(trainDat[,predictors],
                 trainDat$label,
                 method="rf",
                 importance=TRUE,
                 ntree=50) # 50 is quite small (default=500). But it runs faster.
  
  ## model
  ## plot(model) # see tuning results
  ## plot(varImp(model)) # variable weight
  
  # Save/export model
  # saveRDS(model,file="createdbyAISAtool/RFModel.RDS")
  print("model trained")
  return(model)
}





#######################################################################
# Title: Prediction
# Author: Liliana Gitschel
# Latest Update: 14.12.2021
# 
# Purpose:
#   Make LULC predictions.
#
# Input:
#   sentinel_resampled - grd-data containing the readily resampled sentinel-2-image from AWS
#   model - Trained model in RDS-data format (either uploaded by user or internally created with Skript_TrainModel)
#
# Output:
#   prediction - Prediction for LULC classification (Geotiff)
#
# Reference:
#   Partly based on: https://github.com/HannaMeyer/OpenGeoHub_2021
#
########################################################################

Prediction <- function (sentinel_resampled, model) {
  
  # Create raster stack object
  #sentinel_resampled <- stack(sentinel_resampled)
  # Read model - necessary??
  # model <- readRDS(model)
  
  # Make predictions
  prediction <- predict(sentinel_resampled, model)
  ## spplot(deratify(prediction)) # visualize
  
  # Save/export predictions as Geotiff
  # writeRaster(prediction, "createdbyAISAtool/prediction.tif", overwrite=T)
  print("LULC predicted")
  return (prediction)
}




#######################################################################
# Title: AOA
# Author: Liliana Gitschel
# Latest Update: 14.12.2021
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
#   AOA - Estimation of AOA (Geotiff)
#
# Reference:
#   Partly based on: https://github.com/HannaMeyer/OpenGeoHub_2021

########################################################################


# load input data
# As predictor variables a raster data set with sentinel-2 data is used.
# The data either comes form AWS and is preprocessed internally first or the demodata is used.
# load and build stack with data of predictor variables (=sentinel-2 images)
### yet only running with demodata!
#sentinel_combined <- stack("demodata_rheine_sentinel_combined.grd")
# load model (either created with separate script "Script_TrainModel.R" or user input)
### directory containing model needs adjustment later on
#model <- readRDS("createdbyAISAtool/RFModel.RDS")

AOA <- function (sentinel_resampled, model) {
  
  # Create raster stack object
  #sentinel_resampled <- stack(sentinel_resampled)
  # Read model - necessary??
  # model <- readRDS(model)
  
  # Estimate AOA
  cl <- makeCluster(4) # devide data into 4 clusters (could be more in final version)
  registerDoParallel(cl)  # calculate clusters in parallel to speed up the process
  AOA <- aoa(sentinel_resampled,model,cl=cl)  # estimate AOA
  
  # plot(AOA)  #plot AOA
  
  # Save/export AOA as Geotiff
  # writeRaster(AOA, "createdbyAISAtool/AOA.tif", overwrite=T)
  print("AOA calculated")
  return(AOA)
}


#######################################################################
# Title: runDemo
# Author: Jan Seemann
# Latest Update: 16.12.2021
# 
# Purpose:
#   Run the Demo.
#
# Input: -
#   
#   

# Output:
#  Job Done Message (String)
# Output files are written within the function

runDemo <- function (){
  
  # load input data
  # As predictor variables a raster data set with sentinel-2 data is used.
  # The data either comes form AWS and is preprocessed internally first or the demodata is used.
  # load and build stack with data of predictor variables (=sentinel-2 images)
  ### yet only running with demodata!
  sentinel_combined <- stack("demodata_rheine_sentinel_combined.grd")
  # load training polygons
  ### option for GeoJSON needs to be added!
  trainingsites <- st_read("demodata_rheine_tainingspolygone.gpkg")
  
  # reproject crs of input data to EPSG 900913
  # ensures that data has same crs and that it can be displayed by leaflet
  # for reference see: https://spatialreference.org/ref/sr-org/6627/
  trainingsites <- st_transform(trainingsites,crs= "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs")
  sentinel_combined <- projectRaster(sentinel_combined,crs=crs(trainingsites))
  
  # do calculations
  model <-TrainModel(trainingsites, sentinel_combined)
  predictionLULC <- Prediction(sentinel_combined,model)
  areaOA <- AOA (sentinel_combined,model)
  
  
  #writing output files
  saveRDS(model,file="createdbyAISAtool/modelOutput.RDS")
  print("model output file written")
  writeRaster(predictionLULC, "createdbyAISAtool/predictionOutput.tif", overwrite=T)
  print("LULC output file written")
  writeRaster(areaOA, "createdbyAISAtool/aoaOutput.tif", overwrite=T)
  print("AOA output file written")
  st_write(trainingsites, "createdbyAISAtool/demodata_rheine_trainingspolygone.geojson")
  print("trainingsites geojson output written")
  
  
  return("JobDone")
}
  
  
# Create and start the beakr instance
newBeakr() %>%
  httpGET(path = '/runDemo', decorate(runDemo)) %>%
 
  
  listen(host = "127.0.0.1", port = 25118) #for local testing
  #listen(host = "44.234.41.163", port =  8780) #for AWS


# URL GET API Call for local testing: http://127.0.0.1:25118/runDemo
# URL GET API Call for AWS: http://44.234.41.163:8780/runDemo



