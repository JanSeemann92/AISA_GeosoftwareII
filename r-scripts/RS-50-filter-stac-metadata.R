# Title: RS-50-filter-stac-metadata
# Author: Niklas Daute
# Date created: 1.12.2021
# Version: 1.0
# 
# Purpose:
#   
#   The purpose if this script is to determine which imagery available in the stac response from RS-40 
#   is to be used for further processing. The imagery will be requested in RS-60 and then processed from
#   RS-70 onwards.
#   
# Input:
#   
#   Metadata from STAC Response.
#   Response has the form..
#   
# Output:
#
#   The Output of this script is a subset of the metadata received in RS-40.
#   The main use case for this set of metadata is to request the imagery from AWS
#   using this metadata.
#
# Class - Invariants:
#   
#   -
#   
# Preconditions:
#   
#   The script receives a valid STAC response and can perform the filter operations on it.
#   
# Postconditions:
#   
#   The script provided a valic subset of the Metadata that can be used for requesting the imagery from AWS.
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