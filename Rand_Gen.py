from qiskit.circuit.random import random_circuit
from qiskit.quantum_info import Operator
import numpy as np
import random as rd
from scipy.spatial import distance

def generator():
    rd.seed()
    num_qubit = int(input('Enter the number of Qubits:'))
    depth = int(input('Enter the circuit depth:'))
    end = False
    while end == False:
        Circ =  random_circuit(num_qubit,depth)
        
        Circ_Operator = Operator(Circ)
        Unitary = Circ_Operator.data
        
        origin = np.zeros(2**num_qubit)
        state = np.zeros(2**num_qubit)
        
        for i in range(len(state)):
            state[i] = rd.random()
        length = distance.euclidean(origin,state)    
        state = state/length
        
        flow = np.zeros((Unitary.shape[0],Unitary.shape[1]))
        
        for n in range(Unitary.shape[0]):
                       for m in range(Unitary.shape[1]):
                           sum = 0
                           for i in range(Unitary.shape[1]):
                               sum += state[i]*Unitary[n,i]
                           flow[n,m] = ((state[m].conjugate())*(Unitary[n,m].conjugate())*sum).real 
                           if flow[n,m] < 0:
                               end = True
                               
                               
    valid = FlowCheck(Unitary, state, flow) 
    if valid == True:
        return Unitary, state, flow
    elif valid == False:
        print('An Error has occured restart the game.')
    

def FlowCheck(Unitary, state, flow):
    new_state = np.matmul(Unitary, state)
    initial_prob = abs(state)**2
    final_prob = abs(new_state)**2
    
    row_margin = np.zeros(flow.shape[0])
    for n in range(flow.shape[0]):
        for m in range(flow.shape[1]):
            row_margin[n] += flow[n,m]
    
    col_margin = np.zeros(flow.shape[0])
    for m in range(flow.shape[0]):
        for n in range(flow.shape[1]):
            col_margin[m] += flow[n,m]
            
    outcome1 = np.allclose(initial_prob,col_margin)
    outcome2 = np.allclose(final_prob,row_margin)
    if outcome1 == True & outcome2 == True:
        return True
    else:
        return False

Unitary, state, flow = generator()
print(flow)

