# Modeling section

Contains code to generate data for the modeling section. Concretely, RSA\_model.wppl:
- specifies the model types: prior-based, non-scalar and scalar
- allows prediction generation with or without taking prior probabilities into account
- estimates parameters that best fit the data
- generates model predictions in each of 120 possible trial setups (scatterplot data)
- simulates all trials and infers overall size and order preferences for each model


Prerequisites: WebPPL should be installed
How to run: choose one or more of the modules to run, modify commented out commands at the bottom of the file ("SAMPLE RUNS"), and run the program using WebPPL: 

`webppl RSA_model.wppl --require webppl-json`
