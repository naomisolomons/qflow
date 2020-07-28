"""
Created on Tue Mar  3 14:20:08 2020

@author: ua19167

Interface for QFlow. Thanks Bryan Oakley on stackexchange. 

Largely dependent on original Stage_Selector file created by Sam Mister. Interface created by Naomi Solomons.
"""

from Qflow_Level_Builder import stage
from Graph_Constructor import Graph_Wrapper
from qiskit import QuantumCircuit
from tkinter import *
import webbrowser
from tkinter import font  as tkfont # python 3
#import tkHyperlinkManager

class Stage_Holder:
#This module is currently designed to hold the circuit data needed to constuct each stage.
    
    def __init__(self):
        self.stage_1 = QuantumCircuit(2)
        self.stage_1.h(0)
        
        self.stage_2 = QuantumCircuit(3)
        self.stage_2.h((0,1))
        self.stage_2.cx(1,0)
        self.stage_2.z(2)

class App(Tk):
# Creates the window for the user interface. Creates a container
# and then frames are stacked on top of each other. Visible frame is
# raised above the others.
    def __init__(self):
        Tk.__init__(self)

        self.title_font = tkfont.Font(family='Helvetica', size=18, weight="bold", slant="italic")

        container = Frame(self)
        container.pack(side="top", fill="both", expand=True)
        container.grid_rowconfigure(0, weight=1)
        container.grid_columnconfigure(0, weight=1)

        self.frames = {}
        #These are the main pages for the game - note that RunQFlow is the actual gameplay
        for F in (MainMenu, Instructions, Background, RunQFlow):
            page_name = F.__name__
            frame = F(parent=container, controller=self)
            self.frames[page_name] = frame
            frame.grid(row=0, column=0, sticky="nsew")

        self.show_frame("MainMenu")
        # We start with the Main Menu frame.
    def show_frame(self, page_name):
        '''Show a frame for the given page name'''
        frame = self.frames[page_name]
        frame.tkraise()

class MainMenu(Frame):

    def __init__(self, parent, controller):
        Frame.__init__(self, parent)
        self.controller = controller
        label = Label(self, text="Main Menu", font=controller.title_font)
        label.pack(side="top", fill="x", pady=10)
        # The text is the bit the user sees, not the name of the frame
        button1 = Button(self, text="How to play",
                            command=lambda: controller.show_frame("Instructions"))
        button2 = Button(self, text="Explain the science",
                            command=lambda: controller.show_frame("Background"))
        button3 = Button(self, text="Select level",
                            command=lambda: controller.show_frame("RunQFlow"))
        button4 = Button(self, text="QUIT", fg="red", command=controller.quit) 
        #bug: the quit button works if this is run from the command line, but not from spyder
        
        button1.pack()
        button2.pack()
        button3.pack()
        button4.pack()


class Instructions(Frame):

    def __init__(self, parent, controller):
        Frame.__init__(self, parent)
        self.controller = controller
        label = Label(self, text="How to play", font=controller.title_font)
        instructions = Message(self, text="In QFlow, you will be manipulating quantum circuits. Each stage corresponds to a different circuit, and each stage is broken down into several levels; you need to pass all the levels to pass the stage. In fact, each level corresponds to a different gate (the 'How QFlow works' page explains more of what's going on behind the scenes). \n In each level, you will be shown a graph, made out of nodes connected by edges. Each edge is labelled with a number (its 'flow value'). Some of the flow values will be negative and the goal is, simply, to make all of the values positive. \n How can you do this? You can select a node (not an edge!) by clicking it. You will need to select several nodes (ending with the same one you started with) to make a cycle. Then, by scrolling, you can change the probability flow value of the edges in that cycle, by sending it around the cycle. \n You can change the cycle selected by choosing a new node. Once all the values are positive, the next level will start. Good luck!")
        # Put the instructions for gameplay in here.
        label.pack(side="top", fill="x", pady=10)
        instructions.pack(side="top", fill="x", pady=10)
        button = Button(self, text="Main Menu",
                           command=lambda: controller.show_frame("MainMenu"))
        button4 = Button(self, text="QUIT", fg="red", command=controller.quit)
        button.pack()
        button4.pack()


class Background(Frame):

    def __init__(self, parent, controller):
        Frame.__init__(self, parent)
        self.controller = controller
        label = Label(self, text="How QFlow works", font=controller.title_font)
        science = Message(self, text="QFlow is a game about quantum computers. Within a basic quantum circuit, a unitary operator (or series of unitary operators) act on the input state (which is a set of qubits), and the output is measured - these circuits (within the 'gate model' of quantum computing) are represented by the graphs that are shown in QFlow. \n In these graphs, each node represents a computational basis state, and the numbers above the edges represent the 'probability flow' between basis states, showing how the action of the computational circuit changes the probability of different states being measured as the output. **Maybe put in an example diagram here later, ie a Hadamard** \n The theory behind QFlow is based around a hidden variable theory of quantum computing proposed by Scott Aaronson in 2004, combined with a way of calculating these probability flows and a set of operations that change them conjectured by Sam Mister **and another guy**. By solving levels of QFlow, you are showing that these actions can be carried out to produce a completely positive set of probability flows - which is necessary for the proposed actions to form a valid hidden variable theory. If you find an unbeatable level, you've disproved the conjecture! \n You can find out more about quantum computing and quantum circuits in many places - this is a good place to start. https://www.ibm.com/quantum-computing/learn/what-is-quantum-computing/ \n If you want to know more about how QFlow works specifically, you can read our report about it, here. **Link to project report**")
        # Put information about the background in here. 
        label.pack(side="top", fill="x", pady=10)
        science.pack(side="top", fill="x", pady=10)
        button = Button(self, text="Main Menu",
                           command=lambda: controller.show_frame("MainMenu"))
        button4 = Button(self, text="QUIT", fg="red", command=controller.quit)
        button.pack()
        button4.pack()
        
class RunQFlow(Frame):
    
    def __init__(self, parent, controller):
        Frame.__init__(self, parent)
        self.controller = controller
        label = Label(self, text="Select stage", font=controller.title_font)
        label.pack(side="top", fill="x", pady=10)
        button = Button(self, text="Main Menu",
                           command=lambda: controller.show_frame("MainMenu"))
        button4 = Button(self, text="QUIT", fg="red", command=controller.quit)
        button.pack()
        button4.pack()
        g = Label(self, text='Pick Stage:')
        g.pack()
        self.e = Entry(self)
        self.e.pack()
        button2 = Button(self, text="Enter", command= lambda: [self.e.destroy, self.f(parent, controller)])
        button2.pack()
        
    def f(self, parent, controller, event=None): 
        self.stagenumb = self.e.get() #user inputs stage, this is stored as stagenumb
        Label(self, text='Stage '+self.stagenumb+' loaded').pack()
        
        if self.stagenumb == '1': #if stage 1 is selected all the level graphs are created as json strings and stored in an array
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
            self.h = Message(self, text=str(self.graphs[0]))
            self.h.pack()
            self.j = Label(self, text='Level files generated')
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
            self.j = Label(self, text='Level files generated')
            self.j.pack()
         
        else:
            self.k = Label(self, text='Invalid Selection')
            self.k.pack()
            
        #############################################################################################      
    # This section creates a HTML webpage for each levels of the stage. 
    #This way, the code can be modified to open the first level automatically
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
                            overflow:hidden;
                            }
                        
                        div1 {
                            display: none
                            }
                        
                    </style>
                </head>
                <body id = "body">"""
            html2=        """<div class = "div1" data-graph = "{}"></div>""".format(self.graphs[levels])
                        
            html3=        """<canvas></canvas>
                        <script src="Qflow.js"></script>
                        </body>
                        </html>"""
        
            html = html1+html2+html3
        #This writes the generated HTML version of the graph to a html file which can be viewed in browser
            l = open(r"C:\Users\ua19167\OneDrive - University of Bristol\Documents\Game\QFlow\qflow\Qflow_Level{}.html".format(levels+1), "w")
            l.write(html)
            l.close()
            new = 2
            webbrowser.open(r"C:\Users\ua19167\OneDrive - University of Bristol\Documents\Game\QFlow\qflow\Qflow_Level{}.html".format(levels+1), new=new)

if __name__ == "__main__":
    
    seq= 1 
    w= 500
    h=500
    node_size=1
    
    Stages = Stage_Holder()
    
    app = App()
    app.mainloop()