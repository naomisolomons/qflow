from Qflow_Level_Builder import stage
from qiskit import QuantumCircuit
import numpy as np
import networkx as nx
from qiskit.quantum_info import Statevector
import json
qs = QuantumCircuit(2)
qs.h((0,1))
qs.cx(1,0)
#qs.x((0,1,2,3,4))
#qs.y((0,1,2,3,4))

Stage_One = stage(qs)
Input = Statevector([0.5,0.5,0.5,0.5])
class Graph_Wrapper:
    
    def __init__(self, level_operator, input_state):
        
        self.level_operator = level_operator
        self.input_StateVector = input_state
        self.state_vector = input_state.data
        self.unitary = level_operator.data
        self.support = self.support(self.unitary)    
        self.prob_flows = self.probability_flows()
        
        self.graph = nx.MultiDiGraph(self.support)
        self.mapping = {node:"{0:b}".format(node) for node in self.graph.nodes()}
        for source, target in self.graph.edges():
            self.graph[source][target][0]['weight'] = self.prob_flows[source,target]       
        self.graph = nx.relabel_nodes(self.graph,self.mapping,False)
        self.JSON = json.dumps(nx.node_link_data(self.graph))
        
    def support(self,Matrix):
        support = np.zeros((Matrix.shape), dtype='int32')
        for i in range(Matrix.shape[0]):
            for j in range(Matrix.shape[1]):
                if Matrix[i,j] != 0:
                    support[i,j] = 1
                else:
                        support[i,j] = support[i,j]
        return support
    
    def probability_flows(self):
        flow_matrix = np.zeros((self.unitary.shape))
        
        for i in range(self.unitary.shape[0]):
            for j in range(self.unitary.shape[1]):
                A = 0
                for k in range(self.unitary.shape[0]):
                    A += self.state_vector[k]*self.unitary[i,k]
                flow_matrix[i,j] = (((self.state_vector[j]*self.unitary[i,j]).conjugate())*A).real
        
        return flow_matrix
       
G_wrapper = Graph_Wrapper(Stage_One.levelOperator(1),Input)
    
print(G_wrapper.JSON)
   


