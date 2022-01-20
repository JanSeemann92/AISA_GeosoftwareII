# Title: gpkgToGeojson
# Author: Liliana Gitschel
# Latest Update: 16.12.2021
# 
# Purpose:
#   Convert from Geopackage tp Geojson.
#
# Input:
#   geopackage (i.e. training polygons)
#
# Output:
#   geojson holding same information like input data
#
########################################################################


# delete all variables from environment
rm(list=ls())

# load packages
library(rgdal)
library(sf)

# set working directory: directory which includes needed data
#### needs to be changed later on to the hosting server
setwd("C:/Users/lgits/Documents/GitHub/AISA_GeosoftwareII/BackendDevelopmentLiliana/demodata")

# load input data = training polygons
trainingsites <- st_read("demodata_rheine_trainingspolygone.gpkg")

# convert to geojson and export
st_write(trainingsites, "createdbyAISAtool/demodata_rheine_trainingspolygone.geojson", delete_dsn = TRUE)
