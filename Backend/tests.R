# Title: Tests
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
#loadpackages for API
#library(beakr)
library(rgdal)
# load packages for exporting geojson
library(geojson)
#load package for testing
library (testthat)

# set working directory: directory which includes needed data
#### needs to be changed later on to the hosting server
#setwd("C:/Users/katha/Documents/GitHub/AISA_GeosoftwareII/Backend/demodata/")
setwd("D:/Studium/Geosoftware1/AISA_GeosoftwareII/Backend/demodata")


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




#######################################################################
# Title: runTests
# Author: Jan Seemann
# Latest Update: 18.01.2022
# 
# Purpose:
#   Run the Demo.
#
# Input: -
#   
#   

# Output:


addieren <- function (a,b){
  c <- (a + b) %>%
    #print() 
    return()
}    
   
    test_that("check data types", {
      sentinel_combined <- stack("demodata_rheine_sentinel_combined.grd")
      
      trainingsites <- st_read("demodata_rheine_tainingspolygone.gpkg")
      trainingsites <- st_transform(trainingsites, crs = "+proj=longlat +datum=WGS84 +no_defs")
      expect_type(trainingsites, "list")
      
      sentinel_combined <- projectRaster(sentinel_combined,crs=crs(trainingsites))
      expect_s4_class(sentinel_combined,"RasterBrick")
      
      model <-TrainModel(trainingsites, sentinel_combined)
      expect_type(model, "list")
      
      predictionLULC <- Prediction(sentinel_combined,model)
      expect_s4_class(predictionLULC,"RasterLayer")
      
      areaOA <- AOA (sentinel_combined,model)
      expect_s4_class(areaOA,"RasterStack")
      
      
      samplingLocations <- NewSamplingLocations(areaOA)
      expect_type(samplingLocations, "character")
    })
    #> Test passed 

