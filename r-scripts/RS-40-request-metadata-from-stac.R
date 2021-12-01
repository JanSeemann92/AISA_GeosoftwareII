# Title: RS-40-Request-Metadata-From-Stac
# Author: Niklas Daute
# Date created: 1.12.2021
# Version: 1.0
# 
# Purpose:
#   
#   The Purpose of this script is to receive the necessary metadata from STAC.
#   The metadata can then be used to filter for desired imagery in RS-50 and finally
#   the metadata can be used to request the imagery from amazon web services.
#   
#   If needed, the imagery will be merged and subsampled in RS-70, which is the final
#   step before AOA and ML calculations can be performed on the imagery in (script names here).
#   
# Input:
#   
#   Two coordinates defining a bounding box (input by map UI, or text input in webinterface).
#   Coordinates should be in ??Which CRS??.
#   Valid coordinates are..
#   Order of coordinates is.. (x,y) or (y,x)
#   No Input of Z Coordinate.
#   
# Output:
#   
#   A STAC response containing imagery of the desired bounding box.
#   The response is of the kind..
#   The response will be used in RS-50
#   
# Class - Invariants:
#   
#   -
#   
# Preconditions:
#   
#   -
#   
# Postconditions:
#   
#   -
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