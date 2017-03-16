import React from 'react';

class Footer extends React.Component{

    render() {
        return ( 
            <div style={{clear:"both", paddingTop:"10px"}}>    
                <hr style={{padding:"0",margin:"10 0"}} />  
                <div>                            
                    <div>                    
                        <div className="width-constraint clearfix">                         
                            <p className="pull-left muted credit">&nbsp;&nbsp;Footer MMR v1.0.0</p>
                            <p className="pull-right muted credit">©2017 • ALL RIGHTS RESERVED&nbsp;&nbsp;</p>
                        </div>
                    </div>
                </div> 
                 
            </div>
        );
    }

}

export default Footer;