# Title: AOA
# Author: Liliana Gitschel
# Latest Update: 17.12.2021
# 
# Purpose:
#   Estimate the AOA.
#
# Input:
#   grd-data containing the readily resampled sentinel-2-image from AWS
#   Trained model in RDS-data format (either uploaded by user or internally created with Skript_TrainModel)
#
# Output:
#   Geotiff with AOA.
#
# Reference:
#   Partly based on: https://github.com/HannaMeyer/OpenGeoHub_2021

########################################################################


# delete all variables from environment
rm(list=ls())

# load packages
library(CAST)
library(doParallel) # loads dependencies too

# set working directory: directory which includes needed data
#### needs to be changed later on to the hosting server
setwd("C:/Users/lgits/Documents/GitHub/AISA_GeosoftwareII/BackendDevelopmentLiliana/demodata")

# load input data
# As predictor variables a raster data set with sentinel-2 data is used.
# The data either comes form AWS and is preprocessed internally first or the demodata is used.
# load and build stack with data of predictor variables (=sentinel-2 images)
### yet only running with demodata!
sentinel_combined <- stack("createdbyAISAtool/demodata_rheine_sentinel_combined_EPSG4326.grd")
# load model (either created with separate script "Script_TrainModel.R" or user input)
### directory containing model needs adjustment later on
model <- readRDS("createdbyAISAtool/RFModel_EPSG4326.RDS")


# Estimate AOA
cl <- makeCluster(detectCores()-1) # devide data into clusters
registerDoParallel(cl)  # calculate clusters in parallel to speed up the process
AOA <- aoa(sentinel_combined,model,cl=cl)  # estimate AOA
plot(AOA)  #plot AOA

# extract layer with AOA only (without DI)
AOA_only <- raster(AOA, layer=2)

# Save/export AOA as Geotiff
writeRaster(AOA_only, "createdbyAISAtool/AOA_EPSG4326.tif", overwrite=T)
