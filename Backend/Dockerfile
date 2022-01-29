# Create a layer from the r-base:4.1.2 Docker image
FROM rocker/r-base:4.1.2

RUN mkdir -p /R
WORKDIR /R

# Install package dependencies
RUN apt-get update && apt-get install -y gdal-bin libgdal-dev

RUN apt-get install -y libudunits2-dev

RUN apt-get install -y libjq-dev

RUN apt-get install -y libprotobuf-dev

RUN apt-get install -y protobuf-compiler

#RUN R -e "install.packages('Rcpp')"
#RUN R -e "install.packages('CAST')"
#RUN R -e "install.packages('caret')" 
#RUN R -e "install.packages('doParallel')"
#RUN R -e "install.packages('sf')"
RUN R -e "install.packages('beakr')" 
#RUN R -e "install.packages('rgdal')"
#RUN R -e "install.packages('geojson')"
#RUN R -e "install.packages('testthat')"
#RUN R -e "install.packages('ncdf4')"
#RUN R -e "install.packages('jsonlite')"
#RUN R -e "install.packages('RcppProgress')"
#RUN R -e "install.packages('rstac')"
#RUN R -e "install.packages('gdalcubes')"
#RUN R -e "install.packages('RJSONIO')"
#RUN R -e "install.packages('raster', type = 'source')"

COPY . .

# Expose port on container
EXPOSE 8782

#ENTRYPOINT [ "Rscript"]

# Start the app
CMD Rscript calc.R




