# Title: AOA
# Author: Liliana Gitschel
# Latest Update: 20.12.2021
# 
# Purpose:
#   Suggest new sampling locations based on the areas outside the AOA.
#
# Input:
#   AOA as tif
#
# Output:
#   GeoJson containing points for new sampling locations.
#
########################################################################


# delete all variables from environment
rm(list=ls())

# load packages
library(raster)
library(sf)
library(sp)
library(geojson)

# set working directory: directory which includes needed data
#### needs to be changed later on to the hosting server
setwd("C:/Users/lgits/sciebo/Uni_Geoinfo/GI7_GeosoftwareII/ProjectAISA/AISA_GeosoftwareII/BackendDevelopmentLiliana/demodata")

# load input data as raster stack: AOA
AOA <- stack("createdbyAISAtool/AOA_EPSG4326.tif")

# extract layer containing AOA from raster stack
AOA_only <- raster(AOA, layer=2)

# set values inside AOA (=1) to NA
AOA_only_outside <- reclassify(AOA_only, cbind(1, NA))

# get new sampling locations (method = random)
samples <- sampleRandom(AOA_only_outside, size=50, sp=TRUE)

# convert sampling locations to geojson
samples_geojson <- as.geojson(samples)

# save/export new sampling locations as geojson
write(samples_geojson, "createdbyAISAtool/demodata_rheine_sampling_EPSG4326.geojson")


# as function without loading and exporting the data
NewSamplingLocations <- function(AOA) {
  # extract layer containing AOA from raster stack
  AOA_only <- raster(AOA, layer=2)
  
  # set values inside AOA (=1) to NA
  AOA_only_outside <- reclassify(AOA_only, cbind(1, NA))
  
  # get new sampling locations (method = random)
  samples <- sampleRandom(AOA_only_outside, size=50, sp=TRUE)
  
  # convert sampling locations to geojson
  samples_geojson <- as.geojson(samples)
  
  return(newSamplingLocations)
}