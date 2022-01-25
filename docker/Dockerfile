# Create a layer from the r-base:4.1.2 Docker image
FROM rocker/r-base:4.1.2

# Create an application directory
RUN mkdir -p /app

# The /app directory should act as the main application directory
WORKDIR /app

# Install package dependencies
RUN R -e "install.packages(c('raster', 'CAST', 'caret', 'sf', 'beakr', 'rgdal', 'testthat', 'stars', 'magick', 'ncdf4', 'Rcpp', 'jsonlite', \
                            'RcppProgress', 'rstac', 'tmap', 'gdalcubes', 'RJSONIO') dependencies=TRUE, repos='http://cran.rstudio.com/')"

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
EXPOSE 9000 

ENTRYPOINT [ "npm", "start" ]

CMD ["Rscript", "run.R"]
# Start the app
# CMD ["Rscript", "myscript.R"] 
# oder: CMD R -e "source('/app/myscript.R')"
# CMD cd /app \
#    && R -e "source('myscript.R')" \
#    && mv app/output.csv /app/results/output.csv --> Output auch nach Container Stopp noch haben?


