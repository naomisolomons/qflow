from Qflow_Level_Builder import stage
from Graph_Constructor import Graph_Wrapper
from qiskit import QuantumCircuit

#This module is currently designed to hold the circuit data needed to constuct each stage. The stage selection is currently made
#using the input function but this could be changed to used a tkinter GUI
class Stage_Holder:
    
    def __init__(self):
        self.stage_1 = QuantumCircuit(2)
        self.stage_1.h(0)
        self.stage_1.h(1)
     
        
        self.stage_2 = QuantumCircuit(3)
        self.stage_2.h((0,1))
        self.stage_2.cx(1,0)
        self.stage_2.z(2)
       
if __name__== '__main__':
    
    seq= 1 
    w= 500
    h=500
    node_size=1
    
    Stages = Stage_Holder()
    stagenumber = input('Pick Stage:') #takes user input
    print('Stage',stagenumber,'loaded')
    
    if stagenumber == '1': #if stage 1 is selected all the level graphs are created a json strings and stored in an array
        Stage_Selected = Stages.stage_1
        stage = stage(Stages.stage_1)
        graphs = []
        for levels in range(1,stage.num_levels+1):
            G_wrapper = Graph_Wrapper(stage.levelOperator(levels),stage.levelState(levels))
            temp = G_wrapper.data
            del temp["directed"]
            del temp["multigraph"]
            del temp["graph"]
            graphs.append(temp)
        print(graphs[0])    
        print('Level files generated')
        
    elif stagenumber == '2':
        Stage_Selected = Stages.stage_2
        stage = stage(Stages.stage_2)
        graphs = []
        for levels in range(1,stage.num_levels+1):
            G_wrapper = Graph_Wrapper(stage.levelOperator(levels),stage.levelState(levels))
            temp = G_wrapper.data
            del temp["directed"]
            del temp["multigraph"]
            del temp["graph"]
            graphs.append(temp)
        print('Level files generated')
        
    else:
        print('Invalid Selection')
        
#############################################################################################      
    # This sections creates a HTML webpage for each levels of the stage. 
    #This can the code can be modified to open the first level automatically
    for levels in range(0,stage.num_levels):    
        html1 = """<!DOCTYPE html>
            <html lang = "en">
            <head>
                <meta charset="utf-8">
                <title>Qflow - A Quantum Game</title>
                <style type="text/css">
                    canvas {
                        border: 0px solid black;
                    }
                    
                    body {
                        margin: 0;
                    }
                    
                    div1 {
                        display: none
                    }
                
                </style>
            </head>
            <body id = "body">"""
        html2=        """<div class = "div1" data-graph = "{}"></div>""".format(graphs[levels])
                
        html3=        """<canvas></canvas>
                <script src="Qflow.js"></script>
            </body>
            </html>"""
        
        html = html1+html2+html3
        #This writes the generated HTML version of the graph to a html file which can be viewed in browser
        f = open(r"C:\Users\User\Documents\Cohort_Project\qflow\Qflow_Level{}.html".format(levels+1), "w")
        f.write(html)
        f.close()