import numpy as np
import networkx as nx
import json


class Graph_Wrapper:
    
    def __init__(self, level_operator, input_state, level_number):
        self.level_number = level_number
        self.level_operator = level_operator
        self.input_StateVector = input_state
        self.state_vector = input_state.data
        self.unitary = level_operator.data
        self.support = self.support(self.unitary)    
        self.prob_flows = self.probability_flows()
        
        self.graph = nx.DiGraph(self.support)
        self.mapping = {node:"{0:b}".format(node) for node in self.graph.nodes()}
        self.values = nx.circular_layout(self.graph)
        
        for source, target in self.graph.edges:
            self.graph[source][target]['weight'] = self.prob_flows[source,target]       
        
        for nodes in self.graph.nodes:
            self.graph.nodes[nodes]['x_pos'] = self.values[nodes][0]
            self.graph.nodes[nodes]['y_pos'] = self.values[nodes][1]
            
        self.graph = nx.relabel_nodes(self.graph,self.mapping,False)
        
        
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
    
    def output_JSON(self):
        with open(r'C:\Users\sm15883\.spyder-py3\git_Qflow\level_data_{}.txt'.format(self.level_number),'w') as write_file:
            self.JSON = json.dump(nx.node_link_data(self.graph),write_file)

if __name__== '__main__':
    from Qflow_Level_Builder import stage
    from qiskit import QuantumCircuit
    
    
    qs = QuantumCircuit(2)
    qs.h((0,1))
    qs.cx(1,0)
    qs.x(0)
    qs.y(0)

    Stage_One = stage(qs)
    G_wrapper = Graph_Wrapper(Stage_One.levelOperator(1),Stage_One.levelState(1),1)
    G_wrapper.output_JSON()
    
    

