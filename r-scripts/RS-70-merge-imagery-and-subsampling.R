# Title: RS-70-merge-imagery-and-subsampling
# Author: Niklas Daute
# Date created: 1.12.2021
# Version: 1.0
# 
# Purpose:
#   
#   This script has two purposes.
#   First, the script will merge any imagery to a mosaic if necessary.
#   Second, the script will subsample the image to improve processing time.
#   
# Input:
#   
#   Satellity imagery from RS-60, provided by aws.
#   This can be one or more files.
#   Maybe the number of images should be limited,
#   in this case an error case needs to be created.
#
#   
# Output:
#
#   A single .geoTIFF file, which will serve as the input for further scripts
#   (AOA, ML Algorithms, etc.).
#   The File name will be..
#   Other limitations of this file..
#
# Class - Invariants:
#   
#   -
#   
# Preconditions:
#   
#   The script receives valid input imager from RS-60.
#   Other Preconditions.
#   
# Postconditions:
#   
#   The script has passed the .geoTIFF output image to all scripts that need it.
#   
# Exceptions:
#   
#   -
#   
# Script: 
#   
#   
#   
#   