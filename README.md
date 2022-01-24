Authors: [@Jan](https://github.com/JanSeemann92) [@Katharina](https://github.com/KatharinaGI) [@Antonia](https://github.com/AntoniaJost) [@Niklas](https://github.com/niiiiikd) [@Liliana](https://github.com/GitLiliana)

# Cloud Vision <img src="./imagesReadme/logo.png" align="right" alt="" width="120" />
### Applicability Estimation Tool for Spatial Prediction Models

Cloud Vision offers a simple tool for estimating the applicability of models for land use/land cover (LULC) classifications. Its special focus is on implementing the Area of Applicability (AOA) [Meyer and Pebesma (2021)](https://besjournals.onlinelibrary.wiley.com/doi/10.1111/2041-210X.13650) , a very useful method for assessing and communicating areas a model is applicable for. In addition to this Cloud Vision supports model training, making LULC classifications and suggesting locations for further sampling campaigns.

## Installation

## Getting Started

## Requirements on Input Data

### Area of Interest (AOI)

- One out of two options can be chosen: Draw a rectangle on a given leaflet map or manually enter coordinates.
- Manually entered coordinates must be given in EPSG4326.

### Training Data

- Supported data formats are Geopackage (.gpkg) and GeoJSON (.geojson).
- The LULC classes must be stored under the name "Label".
- Training data should consist of polygons.
- At least two polygons must be given for each LULC class (as spatial cross validation based on the polygons is used).

### Model
- Models must come as single R objects (.RDS).
- Models must have been trained on a selection of the following bands from sentinel-2 images: B02, B03, B04, B05, B06, B07, B08, B11, B12, B8A.
- Predictors must be named likewise: "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B11", "B12", "B8A".

## Specifications

### Generating Sentinel-2 images from AWS

The following parameters can be chosen by the user within the webtool:
- Resolution of requested sentinel-2 images can be 20m (default), 40m or 80m.
- 

### Model Training and Prediction

### Estimating AOA

### Suggesting New Sampling Locations
