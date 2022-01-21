# Title: TrainModel
# Author: Liliana Gitschel
# Latest Update: 19.01.2022
# 
# Purpose:
#   Train a model when no model is given by the user.
#
# Input:
#   GeoPackage containing labelled training polygons (User Input), important: lables must be named "label"!!
#   grd-data containing the readily resampled sentinel-2-image from AWS
#
# Output:
#   RDS-data containing the trained model.
#
# Reference:
#   Partly based on: https://github.com/HannaMeyer/OpenGeoHub_2021

########################################################################


# delete all variables from environment
rm(list=ls())

# load packages
library(raster)
library(sf)
library(caret)
library(CAST)

# set working directory: directory which includes needed data
#### needs to be changed later on to the hosting server
setwd("C:/Users/lgits/Documents/GitHub/AISA_GeosoftwareII/BackendDevelopmentLiliana/demodata/demodata_small")

# load input data
# As predictor variables a raster data set with sentinel-2 data is used.
# The data either comes form AWS and is preprocessed internally first or the demodata is used.
# load and build stack with data of predictor variables (=sentinel-2 images)
### yet only running with demodata!
sentinel_combined <- stack("demodata_rheine_sentinel_combined.grd")
# load training polygons
### option for GeoJSON needs to be added!
trainingsites <- st_read("demodata_rheine_trainingspolygone.gpkg")

# reproject crs of input data to EPSG4326
# ensures that data has same crs and that it can be displayed by leaflet
# for reference see: https://epsg.io/4326 , https://leafletjs.com/reference-0.7.7.html#icrs
trainingsites <- st_transform(trainingsites,crs= "+proj=longlat +datum=WGS84 +no_defs")
sentinel_combined <- projectRaster(sentinel_combined,crs=crs(trainingsites))

# write input data in EPSG4326
st_write(trainingsites, "createdbyAISAtool/demodata_rheine_trainingspolygone_EPSG4326.geojson", delete_dsn = TRUE)
writeRaster(sentinel_combined, "createdbyAISAtool/demodata_rheine_sentinel_combined_EPSG4326.grd", overwrite=TRUE)

# Extract only those pixels from the combined sentinel data, that are within the training polygons
extr <- extract(sentinel_combined, trainingsites, df=TRUE)
## head(extr)

# Add information of labels of polygons to data
trainingsites$PolyID <- 1:nrow(trainingsites)
extr <- merge(extr, trainingsites, by.x="ID", by.y="PolyID")
## head(extr)

# Save/export the training data -> not required
# saveRDS(extr, file="createdbyAISAtool/trainData.RDS")

# set predictors (whole data from raster stack) and response (label for LULC)
predictors <- names(sentinel_combined)

### limit data? 
# Proportion of data from each training polygon should be kept
# here:10% of each training polygon (see ?createDataPartition)
trainIDs <- createDataPartition(extr$ID,p=0.1,list = FALSE)
trainDat <- extr[trainIDs,]

# Make sure no NA is given in predictors:
trainDat <- trainDat[complete.cases(trainDat[,predictors]),]

# Train  model
model <- train(trainDat[,predictors],
               trainDat$Label,
               method="rf",
               importance=TRUE,
               ntree=50) # 50 is quite small (default=500). But it runs faster.

model

# train model with random forest and  tuning using cross validation and kappa

# create spatial folds for cross validation
trainids <- CreateSpacetimeFolds(trainDat,spacevar="ID",class="Label",k=3)

model_CV <- train(trainDat[,predictors],
               trainDat$Label,
               method="rf",
               importance=TRUE,
               metric="Kappa", # Optimaler mtry Wert über Kappa
               tunelength=length(predictors),
               ntree=200, # 50 is quite small (default=500). But it runs faster.
               trControl=trainControl(method="cv",index=trainids$index,savePredictions="all"))
model_CV
## plot(model) # see tuning results
## plot(varImp(model)) # variable weight

# Save/export model
saveRDS(model,file="createdbyAISAtool/RFModel_EPSG4326.RDS")
