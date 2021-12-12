# Import libraries 
library(beakr)



#function start-demo to decorate for the API

# Use beakr to expose the demoe in the "/startd-emo" url path.
#   See help("decorate") for more info about decorating functions.
newBeakr() %>%
  httpPOST(path = "/start-demo", decorate(start-demo)) %>%
  handleErrors() %>%
  listen(host = "127.0.0.1", port = 25118)


