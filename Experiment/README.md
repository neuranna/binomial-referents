# Experiment Setup

Experiments were run on [Ibex Farm](http://spellout.net/ibexfarm/). 
"mainExperiment" contains files used to run the main experiment (with three referent image pairs).
"imageNorming" describes the experimental setup used for image norming.

In both cases, the experiment-specific code is mostly contained in the "data\_includes" directory. 

To run locally, navigate to "www" and run the server file: `python server.py`
By default, it will run on http://localhost:3000/experiment.html

Alternatively, you can upload the relevant files (in "data\_includes" and "chunk\_includes") to Ibex Farm.

More detailed instructions can be found in the [Ibex Farm Manual](http://spellout.net/latest\_ibex\_manual.pdf).
