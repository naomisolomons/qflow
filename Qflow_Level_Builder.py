import sys; sys.executable
from qiskit import(QuantumCircuit)
from qiskit.quantum_info import Operator

qc = QuantumCircuit(5)
qc.h(0)
qc.x(1)
qc.y(3)
qc.cx(2,0)
qc.cx(4,0)
qc.x(0)

class stage:
    
    def __init__(self, Qiskit_circuit):
        self.circuit = Qiskit_circuit
        self.num_levels = (Qiskit_circuit.depth()-1)
        
        
    def reduce(self,circ):
        #Copy_circuit = self.circuit.copy()
        Initital_depth = circ.depth()
        depth = circ.depth()
        data = circ.data
        while depth == Initital_depth:
            data.pop()
            depth = circ.depth()
        return circ
        
    def subcirc(self,Level_Num):
        reduction_val = self.num_levels - Level_Num
        subcirc = self.circuit
        for i in range(reduction_val):
            subcirc = self.reduce(subcirc)
        return subcirc    
        
    def level(self,Level_Num):
        Subcirc_N = self.subcirc(Level_Num)
        Subcirc_N_0 = self.subcirc((Level_Num-1))
        data = Subcirc_N.data
        data_0 = Subcirc_N_0.data
        print(data)
        print('-----------------------------------------------')
        print(data_0)
        print('-----------------------------------------------')
        data = [item for item in data + data_0 if item not in data or item not in data_0]       
        print(data)
        return Subcirc_N
    
    
    
    
Stage = stage(qc)
#Stage.level(3).draw(output= 'mpl')

Stage.level(2).draw(output= 'mpl')

#Stage.level(1).draw(output= 'mpl')







#qc.draw(output ='mpl')
#A= Operator(qc)
#print(A)


