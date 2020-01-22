import sys; sys.executable
from qiskit.quantum_info import Operator

#naomi practice comment

class stage:
    
    def __init__(self, Qiskit_circuit):
        self.circuit = Qiskit_circuit
        self.num_levels = (Qiskit_circuit.depth())
        
        
    def reduce(self,circ):
        #Copy_circuit = self.circuit.copy()
        Initial_depth = circ.depth()
        depth = circ.depth()
        data = circ.data
        while depth == Initial_depth:
            data.pop()
            depth = circ.depth()
        return circ
        
    def subcirc(self,Level_Num):
        reduction_val = self.num_levels - Level_Num
        subcirc = self.circuit.copy()
        for i in range(reduction_val):
            subcirc = self.reduce(subcirc)
        return subcirc    
        
    def level(self,Level_Num):
        Subcirc_N = self.subcirc(Level_Num)
        Subcirc_N_0 = self.subcirc(Level_Num-1)
        data = Subcirc_N.data
        data_0 = Subcirc_N_0.data
        Subcirc_N.data = [item for item in data + data_0 if item not in data or item not in data_0]       
        return Subcirc_N
    
    def levelOperator(self,Level_Num):
        QC = self.level(Level_Num)
        leveloperator = Operator(QC) 
        return leveloperator
    





