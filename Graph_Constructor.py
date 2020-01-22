from Qflow_Level_Builder import stage
from qiskit import QuantumCircuit
import numpy as np
import networkx as nx

qs = QuantumCircuit(3)
qs.h((0,1))
qs.swap(0,2)
#qs.x((0,1,2,3,4))
#qs.y((0,1,2,3,4))

Stage_One = stage(qs)

class Graph_Wrapper:
    
    def __init__(self, level_operator):
        self.level_operator = level_operator
        #self.initial_state = initial_state
        self.unitary = level_operator.data
        self.support = self.support(self.unitary)    
        self.graph = nx.from_numpy_matrix(self.support)
        
    def support(self,Matrix):
        support = np.zeros((Matrix.shape), dtype='int32')
        for i in range(Matrix.shape[0]):
            for j in range(Matrix.shape[1]):
                if Matrix[i,j] != 0:
                    support[i,j] = 1
                else:
                        support[i,j] = support[i,j]
        return support
        
G_wrapper = Graph_Wrapper(Stage_One.levelOperator(1))
nx.draw_circular(G_wrapper.graph)