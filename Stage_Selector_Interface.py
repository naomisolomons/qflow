from Qflow_Level_Builder import stage
from Graph_Constructor import Graph_Wrapper
from qiskit import QuantumCircuit
from tkinter import *


class Stage_Holder:
    
    def __init__(self):
        self.stage_1 = QuantumCircuit(2)
        self.stage_1.h((0,1))
        self.stage_1.x((0,1))
        
        self.stage_2 = QuantumCircuit(3)
        self.stage_2.h((0,1))
        self.stage_2.cx(1,0)
        self.stage_2.z(2)
        
class App:
    def __init__(self, master):        
        frame = Frame(master)
        frame.pack()

        self.button1 = Button(frame, text="QUIT", fg="red", command=frame.quit)
        self.button1.pack(side=LEFT)

        self.run_stage = Button(frame, text="Begin", command=self.run_qflow)
        self.run_stage.pack(side=LEFT)
        
    def run_qflow(self):
        frame = Frame(root)
        frame.pack()
        self.g = Label(root, text='Pick Stage:')
        self.g.pack()
        self.e = Entry(root)
        self.e.pack()
        self.run_stage.destroy()
        self.button2 = Button(text="Enter", command= lambda: [self.e.destroy, self.f()])
        self.button2.pack(side=LEFT)
        
    def f(self, event=None): 
    #    print(self.e.get())
        self.stagenumb = self.e.get()
        Label(root, text='Stage '+self.stagenumb+' loaded').pack()
        self.g.destroy()
        self.e.destroy()
        self.button2.destroy()
        
        if self.stagenumb == '1': #if stage 1 is selected all the level graphs are created a json strings and stored in an array
            self.Stage_Selected = Stages.stage_1
            self.stagevar = stage(Stages.stage_1)
            self.graphs = []
            for levels in range(1,self.stagevar.num_levels+1):
                G_wrapper = Graph_Wrapper(self.stagevar.levelOperator(levels),self.stagevar.levelState(levels))
                temp = G_wrapper.data
                del temp["directed"]
                del temp["multigraph"]
                del temp["graph"]
                self.graphs.append(temp)
            self.h = Message(root, text=str(self.graphs[0]))
            self.h.pack()
            self.j = Label(root, text='Level files generated')
            self.j.pack()
        
        elif self.stagenumb == '2':
            Stage_Selected = Stages.stage_2
            self.stagevar = stage(Stages.stage_2)
            self.graphs = []
            for levels in range(1,self.stagevar.num_levels+1):
                G_wrapper = Graph_Wrapper(self.stagevar.levelOperator(levels),self.stagevar.levelState(levels))
                temp = G_wrapper.data
                del temp["directed"]
                del temp["multigraph"]
                del temp["graph"]
                self.graphs.append(temp)
            self.j = Label(root, text='Level files generated')
            self.j.pack()
        
        else:
            self.k = Label(root, text='Invalid Selection')
            self.k.pack()
            
        #############################################################################################      
    # This sections creates a HTML webpage for each levels of the stage. 
    #This can the code can be modified to open the first level automatically
        for levels in range(0,self.stagevar.num_levels):    
            html1 = """<!DOCTYPE html>
                <html lang = "en">
                <head>
                    <meta charset="utf-8">
                    <title>Qflow - A Quantum Game</title>
                    <style type="text/css">
                        canvas {
                            border: 1px solid black;
                            }
                        
                        body {
                            margin: 0;
                            }
                        
                        div1 {
                            display: none
                            }
                        
                    </style>
                </head>
                <body>"""
            html2=        """<div class = "div1" data-graph = "{}"></div>""".format(self.graphs[levels])
                        
            html3=        """<canvas></canvas>
                        <script src="Qflow.js"></script>
                        </body>
                        </html>"""
        
            html = html1+html2+html3
        #This writes the generated HTML version of the graph to a html file which can be viewed in browser
            l = open(r"C:\Users\ua19167\Documents\qflow\Qflow_Level{}.html".format(levels+1), "w")
            l.write(html)
            l.close()
            
            
if __name__== '__main__':
    
    seq= 1 
    w= 500
    h=500
    node_size=1
    
    Stages = Stage_Holder()
        
root = Tk()
app = App(root)
        
root.mainloop()
root.destroy()