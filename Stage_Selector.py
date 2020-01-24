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
    
    seq= 1 
    w= 1
    h=1
    node_size=1
    
    Stages = Stage_Holder()
    stagenumber = input('Pick Stage:')
    print('Stage',stagenumber,'loaded')
    
    if stagenumber == '1':
        Stage_Selected = Stages.stage_1
        stage = stage(Stages.stage_1)
        graphs = []
        for levels in range(1,stage.num_levels+1):
            G_wrapper = Graph_Wrapper(stage.levelOperator(levels),stage.levelState(levels))
            graphs.append(G_wrapper.JSON)
        print('Level files generated')
        
    elif stagenumber == '2':
        Stage_Selected = Stages.stage_2
        stage = stage(Stages.stage_2)
        graphs = []
        for levels in range(1,stage.num_levels+1):
            G_wrapper = Graph_Wrapper(stage.levelOperator(levels),stage.levelState(levels))
            G_wrapper.output_JSON()
            graphs.append(G_wrapper.output_JSON())
        print('Level files generated')
        
    else:
        print('Invalid Selection')
        
#############################################################################################      
    for levels in range(1,stage.num_levels+1):    
        html1 = """<!DOCTYPE html>
            <meta charset="utf-8">
            <style> body { font-family: sans-serif; }
        .div1 {
          margin: auto;
          width: 1000px;
          height: 500px;
        }
        
        .div2 {
          margin: auto;
          width: 500px;
          height: 200px;
        }
            </style>
            <body>
            <div class="div2"></div>
        <div  class="div1" style="overflow:auto" id="graph-output-1" /div>
            <script src="require.js"></script>
            <script>
            require.config({
                    paths: {
                            d3: "d3.v4.min"
                            }
                    });
            require.config({
                    paths: {
                            Qflow: "Qflow"
                            }
                    });
                        """
        
        html2= """require(['Qflow'], function(Qflow) {{
                    Qflow.showGraph('#graph-output-{0}',
                    JSON.parse('{1}'), {2}, {3}, {4});
                }});
                </script>""".format(seq, graphs[levels], w, h, node_size) 
        html = html1+html2
        
        
        #This writes the generated HTML version of the graph to a html file which can be viewed in browser
        f = open(r"C:\Users\sm15883\.spyder-py3\git_Qflow\Qflow.html", "w")
        f.write(html)
        f.close()