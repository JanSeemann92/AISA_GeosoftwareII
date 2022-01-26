# Create a layer from the r-base:4.1.2 Docker image
FROM rocker/r-base:4.1.2

# Create an application directory
# RUN mkdir -p /app

# The /app directory should act as the main application directory
# WORKDIR /app

#set up working diretory
#RUN sudo setwd("/home/ubuntu/AISA_GeosoftwareII/Backend")
#RUN echo "setwd(\"/home/ubuntu/AISA_GeosoftwareII/Backend\")" 

# Install package dependencies
# install GDAL---> for latest version do: 
    # RUN add-apt-repository ppa:ubuntugis/ppa
#RUN apt-get update && apt-get install -y gdal-bin libgdal-dev

#RUN apt-get install -y libudunits2-dev

#RUN apt-get install -y libjq-dev

#RUN apt-get install -y libprotobuf-dev

#RUN apt-get install -y protobuf-compiler

#RUN R -e "install.packages('Rcpp')"
#RUN R -e "install.packages('CAST')"
#RUN R -e "install.packages('caret')" 
#RUN R -e "install.packages('doParallel')"
#RUN R -e "install.packages('sf')"
#RUN R -e "install.packages('beakr')" 
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
EXPOSE 8783 

# Start the app
CMD ["Rscript", "calc.R"]




