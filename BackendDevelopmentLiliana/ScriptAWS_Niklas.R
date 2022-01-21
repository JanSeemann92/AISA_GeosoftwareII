#
# libraries
#

library(rstac) 
library(gdalcubes)

#
# variables
#

# STAC catalog

s <- stac("https://earth-search.aws.element84.com/v0")

# cloudcover (0 - 100)

cloudcover <- 20

# bounding box

left <- 100.42225372368296
right <- 100.53537857251389
top <- 36.921982522612886
bottom <- 36.88581241761994

#resolution (20,40,80)

resolution <- 20

#
# query STAC
#

items <- s %>%
  stac_search(collections = "sentinel-s2-l2a-cogs",
              bbox = c(left,top,right,bottom), # Geneva
              datetime = "2020-01-01/2020-12-31",
              limit = 500) %>%
  post_request() 


#
# filter by cloud cover
#

system.time(col <- stac_image_collection(items$features,
                                         property_filter = function(x)
                                         {x[["eo:cloud_cover"]] < cloudcover}))


#
# create cubeview
#

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


#
# create datacube and output
#

S2.mask = image_mask("SCL", values=c(3,8,9)) # clouds and cloud shadows
gdalcubes_options(threads = 4) 
raster_cube(col, v) %>%
  select_bands(c("B02",
                 "B03",
                 "B04")) %>%
  reduce_time(c("median(B02)",
                "median(B03)",
                "median(B04)")) %>%
  write_tif(dir="C:/Users/lgits/Documents/GitHub/AISA_GeosoftwareII/BackendDevelopmentLiliana/demodata/AWSimages") %>%
  plot(rgb = 3:1, zlim=c(0,1800)) %>% system.time()