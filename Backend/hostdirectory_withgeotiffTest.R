#library(readr)
library(beakr)
library(MazamaCoreUtils)

options(stringsAsFactors = FALSE)
library(raster)
library(dplyr)
library(tidyverse)


#set temporary hostDir
hostDir <- tempdir()
setwd (hostDir)


#test GeoTIFF modelled after https://inbo.github.io/tutorials/tutorials/spatial_standards_raster/

artwork <- 
  raster(extent(188500, 190350, 227550, 229550), # xmin, xmax, ymin, ymax
         res = 50, # resolution of 50 meters
         crs = 31370) %>% 
  setValues(runif(ncell(.)))  # fill with random values

#spplot(artwork) plot option

#write test geoTiff
artwork %>% 
  writeRaster("artwork.tif", overwrite = TRUE)




# Create an new beakr instance
beakr <- newBeakr()

# beakr pipeline of handlers
beakr %>%

# Host the directory of static files
serveStaticFiles("/test", hostDir, verbose = TRUE) %>%
  
  handleErrors() %>%
  
   
  # Start the server on port 25118
  listen(host = "127.0.0.1", port = 25118, daemon = TRUE)

# ------------------------------------------------------------
# POINT YOUR BROWSER AT:
# * http://127.0.0.1:25118/test/artwork.tif


