# Create a layer from the r-base:4.1.2 Docker image
FROM rocker/r-base:4.1.2

# Create an application directory
# RUN mkdir -p /app

# The /app directory should act as the main application directory
# WORKDIR /app

# Install package dependencies


#RUN sudo setwd("/home/ubuntu/AISA_GeosoftwareII/Backend")
RUN echo "setwd(\"/home/ubuntu/AISA_GeosoftwareII/Backend\")" 
#> ~/../home/rstudio/.Rprofile 
#set up working diretory

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

# Copy or project directory (locally) in the current directory of our docker image (/app)
# COPY apis.R /backend
# COPY hostdirectory_withgeotiffTest.R /
# COPY runDemo.R /
# COPY tests.R /
# COPY ScriptAOA.R /BackendDevelopmentLiliana
# COPY Script_MainCalculations.R /
# COPY Script_NewSamplingLocations.R /
# COPY Script_Prediction.R /
# COPY Script_PrepareEnvironment.R /
# COPY Script_TrainModel.R /r-scripts 
# COPY Script_gpkgToGeojson.R /
# COPY RS-40-request-metadata-from-stac.R /
# COPY RS-50-filter-stac-metadata.R /
# COPY RS-60-request-imagery-from-aws.R /
# COPY RS-70-merge-imagery-and-subsampling.R / 
# Pfade ergänzen | Note that here, the myscript.R has to be in the same folder as the Dockerfile on your computer

#oder doch nur: ???
COPY . .

# Expose port on container. --> anpassen?!
EXPOSE 8783 

# ENTRYPOINT [ "npm", "start" ]

CMD ["Rscript", "calc.R"]
# Start the app
# CMD ["Rscript", "myscript.R"] 
# oder: CMD R -e "source('/app/myscript.R')"
# CMD cd /app \
#    && R -e "source('myscript.R')" \
#    && mv app/output.csv /app/results/output.csv --> Output auch nach Container Stopp noch haben?


