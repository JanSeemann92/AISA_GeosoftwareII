# Title: PrepareEnvironment
# Author: Liliana Gitschel
# Latest Update: 13.12.2021
# 
# Purpose:
#   This skript only needs to be run once to prepare the working environment (on AWS or any other server).
#   It installs the required R-packages needed for AISA's AOA Estimation Tool.

########################################################################


# delete all variables from environment
rm(list=ls())

# install packages needed to train a model, make predictions and estimate AOA
install.packages("raster")
install.packages("CAST")  # installs dependencies, too
install.packages("caret")  # installs dependencies, too
install.packages("sf")
install.packages("beakr")  # needed for API; installs dependencies, too
install.packages("doParallel")
# not required yet:
## install.packages("latticeExtra")  # installs dependencies, too
## install.packages("rgdal")   # needed for package mapview
## install.packages("mapview")
## install.packages("tmap")  # installs dependencies, too
## install.packages("doParallel")
## install.packages("Orcs")  # installs dependencies, too
## install.packages("randomForest")
