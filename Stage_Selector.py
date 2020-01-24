from Qflow_Level_Builder import stage
from Graph_Constructor import Graph_Wrapper
from qiskit import QuantumCircuit


class Stage_Holder:
    
    def __init__(self):
        self.stage_1 = QuantumCircuit(2)
        self.stage_1.h((0,1))
        self.stage_1.x((0,1))
        
        self.stage_2 = QuantumCircuit(3)
        self.stage_2.h((0,1))
        self.stage_2.cx(1,0)
        self.stage_2.z(2)
    
    
    
    
if __name__== '__main__':
    Stages = Stage_Holder()
    stagenumber = input('Pick Stage:')#str(sys.argv[1])
    if stagenumber == '1':
        Stage_Selected = Stages.stage_1
        stage = stage(Stages.stage_1)
        for levels in range(1,stage.num_levels+1):
            G_wrapper = Graph_Wrapper(stage.levelOperator(levels),stage.levelState(levels),levels)
            G_wrapper.output_JSON()
    elif stagenumber == '2':
        Stage_Selected = Stages.stage_2
        stage = stage(Stages.stage_2)
        for levels in range(1,stage.num_levels+1):
            G_wrapper = Graph_Wrapper(stage.levelOperator(levels),stage.levelState(levels),levels)
            G_wrapper.output_JSON()
    else:
        print('Invalid Selection')