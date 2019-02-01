
var green=0,alpha=0.1,i=0;
$(function(){	
	var c=document.getElementById("radar");
	var ctx=c.getContext("2d");
	ctx.fillStyle="#000000";
	var x=radarRadius=$("#radar").width()/2,y=$("#radar").height()/2;
	if(x>y){
		radarRadius=y;
	}
	//ctx.fillRect(0,0,$("#radar").width(),$("#radar").height());
	ctx.strokeStyle="#00ff00";
	ctx.beginPath();
	ctx.arc(x,y,radarRadius,0,2*Math.PI);
	ctx.fill();
	ctx.beginPath();
	ctx.arc($("#radar").width()/2,$("#radar").height()/2,$("#radar").width()/2-1,0,2*Math.PI);
	ctx.stroke();	
	ctx.strokeStyle="#008800";
	for(i=0;i<radarRadius;i=i+radarRadius/5){
		ctx.beginPath();
		ctx.arc(x,y,radarRadius-i,0,2*Math.PI);
		ctx.stroke();	
	}
	c=document.getElementById("needleRotation");
	ctx=c.getContext("2d");
	
	var canImageData = ctx.getImageData(0, 0, $("#radar").width(), $("#radar").height());
	var m,x1,y1;
	
	
		{
			for(i=0;i<80;){
				m=Math.tan(i*Math.PI/180);
				ctx.beginPath();
				ctx.strokeStyle  = "rgba(0,"+green+",0,"+alpha+")";
				if(i%5==0){
					alpha=alpha+0.01;
				}
				green=green+1;
				ctx.beginPath();
				x1=radarRadius/Math.sqrt(1+m*m);
				if((i>90 && i<=180)||(i>180 && i<=270)){
					x1=x1*-1;
				}
				y1=m*x1+y;
				x1=x1+x;
				ctx.moveTo(x,y);
				ctx.lineTo(x1,y1);
				ctx.stroke();
				i=i+0.2;
				
			}
			ctx.closePath();
			for(j=0;j<100;j++){
				m=Math.tan(i*Math.PI/180);			
				ctx.beginPath();
				ctx.strokeStyle="#00ff00";
				ctx.strokeStyle  = "rgba(0,255,0,1)";
				x1=radarRadius/Math.sqrt(1+m*m);
				if((i>90 && i<=180)||(i>180 && i<=270))	{
						x1=x1*-1;
				}
				y1=m*x1+y;
				x1=x1+x;
				ctx.moveTo(x,y);
				ctx.lineTo(x1,y1);
				ctx.stroke();
			}
			
			
		}
	i=0;		
	/*setInterval(function()
		{	

			//var distance=xmlDoc.getElementsByTagName(i.toString())[0].childNodes[0].nodeValue;
			$("#needleRotation").css("transform","rotate("+i+"deg) ");
			/*var c = document.getElementById("dataPlot");
			var ctx = c.getContext("2d");
			ctx.beginPath();
			ctx.arc(i,50,5,0,2*Math.PI);
			ctx.strokeStyle = "#0f0";
			ctx.stroke();*/
			/*socket.emit('angle', i);
			i++;
			if(i==360){
				i=0;
				//ctx.clearRect(0, 0, 200, 200);
			}
		},10);
*/


	/*setInterval(function(){
		{
		//ctx.putImageData(canImageData,0, 0);
			ctx.fillStyle="#000000";
			ctx.fillRect(0,0,$("#radar").width(),$("#radar").height());
			var t=i;
			for(j=0;j<10;){
				m=Math.tan(i*Math.PI/180);
				ctx.beginPath();
				ctx.strokeStyle  = "rgba(0,"+green+",0,"+alpha+")";
				if(i%5==0){
					alpha=alpha+0.1;
				}
				green=green+1;
				ctx.beginPath();
				x1=radarRadius/Math.sqrt(1+m*m);
				if((i>90 && i<=180)||(i>180 && i<=270)){
					x1=x1*-1;
				}
				y1=m*x1+y;
				x1=x1+x;
				ctx.moveTo(x,y);
				ctx.lineTo(x1,y1);
				ctx.stroke();
				i=i+0.2;
				if(i>360){
					i=0;
				}
				j=j+0.2;
				
			}
			i=t+2;
			if(i>360){
					i=0;
				}
			m=Math.tan(i*Math.PI/180);
			ctx.beginPath();
			ctx.strokeStyle  = "rgba(0,255,0,1)";
			if(i%5==0){
				alpha=alpha+0.1;
			}
			green=green+1;
			ctx.beginPath();
			x1=radarRadius/Math.sqrt(1+m*m);
			if((i>90 && i<=180)||(i>180 && i<=270))	{
					x1=x1*-1;
			}
			y1=m*x1+y;
			x1=x1+x;
			ctx.moveTo(x,y);
			ctx.lineTo(x1,y1);
			ctx.stroke();
		}	
	},100);*/
	
});
