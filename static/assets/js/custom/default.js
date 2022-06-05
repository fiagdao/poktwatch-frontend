$(function(){$("[rel='tooltip']").tooltip({html:true});});var intCounterColor=0;var maxloop=200;var ws;var socketurl;var lastprice;if(location.protocol==='https:'){socketurl="wss://"+window.location.hostname+"/wshandler";}else{socketurl="ws://"+window.location.hostname+"/wshandler";}
$().ready(function(){function connectsocket(stype){var intcounter=0;ws=new WebSocket(socketurl);ws.onopen=function(){console.log("->Connected..");var ping=pinger(ws);if(ws.readyState==WebSocket.OPEN){ws.send('{"event": "'+stype+'"}');}
else{console.log("->Connection is closed");}};ws.onmessage=function(evt){if(evt.data!==''){var obj=jQuery.parseJSON(evt.data);if(obj.dashb!==undefined){if(lastprice!==obj.dashb.price){$('#price').fadeOut(0,function(){$(this).text(obj.dashb.price).fadeIn(1000);});var decPercentage;if(obj.dashb.decOpenPrice<obj.dashb.decCurrentPrice){decPercentage="<font color='#0ADC00' size='2'> <i class='fa fa-caret-up' style='font-size: 1em; margin-top:8px; margin-right:3px; color:#0ADC00'></i><b>"+(((obj.dashb.decCurrentPrice-obj.dashb.decOpenPrice)/obj.dashb.decOpenPrice)*100).toFixed(2)+"%</b></font>";}else if(obj.dashb.decOpenPrice>obj.dashb.decCurrentPrice){decPercentage="<font color='brown' size='2'> <i class='fa fa-caret-down' style='font-size: 1em; margin-top:8px; margin-right:3px; color:brown'></i>"+(Math.abs((obj.dashb.decCurrentPrice-obj.dashb.decOpenPrice)/obj.dashb.decOpenPrice)*100).toFixed(2)+"%</font>";}
$('#price_percent').fadeOut(0,function(){$(this).html(decPercentage).fadeIn(400);});}
lastprice=obj.dashb.price;intcounter=intcounter+1;if(intcounter>maxloop){console.log("maxloop = "+maxloop+", closing connnection");ws.close();}else{$('#facube').addClass("fa-spin");$('#faalt').addClass("fa-spin");for(var i in obj.blocks){$('#mCSB_1_container div.row').last().remove();$('#mCSB_1_container hr').last().remove();$(insertblock(obj.blocks[i].b_no,obj.blocks[i].b_time,obj.blocks[i].b_miner_tag,obj.blocks[i].b_miner,obj.blocks[i].b_txns,obj.blocks[i].b_mtime,obj.blocks[i].b_reward)).hide().prependTo("#mCSB_1_container").fadeIn(1250);startstopwatch(obj.blocks[i].b_time,"cd"+obj.blocks[i].b_no);}
var strColor;intCounterColor=intCounterColor+1;if(intCounterColor===1){strColor="color-three";}else if(intCounterColor===2){strColor="color-six";}else if(intCounterColor===3){strColor="color-five";}else if(intCounterColor===4){strColor="color-four";}else{strColor="color-seven";intCounterColor=0;}
for(var i in obj.txns){$('#mCSB_2_container div.row').last().remove();$('#mCSB_2_container hr').last().remove();$(inserttransaction(obj.txns[i].t_hash,obj.txns[i].t_from,obj.txns[i].t_to,obj.txns[i].t_contractAddress,obj.txns[i].t_amt,obj.txns[i].t_time,strColor)).prependTo("#mCSB_2_container");startstopwatch(obj.txns[i].t_time,"cd"+obj.txns[i].t_hash);}
setTimeout(function(){$('#facube').removeClass("fa-spin");$('#faalt').removeClass("fa-spin");},500);}}}};ws.onerror=function(evt){console.log("->socket error");stopTimerAll();};ws.onclose=function(){var d=new Date();console.log("->disconnected..");stopTimerAll();};}
connectsocket("gs");startTimerAll();function insertblock(height,age,strTagName,miner,noOfTransactions,strBlockTime,blockReward){var output;output="<div class='row'>";output+="<div class='col-sm-4'>";output+="<div class='media align-items-sm-center mr-4 mb-1 mb-sm-0'>";output+="<div class='d-none d-sm-flex mr-2'>";output+="<span class='btn btn-icon btn-soft-secondary'>";output+="<span class='btn-icon__inner text-dark'>"+lang_bk+"</span>";output+="</span>";output+="</div>";output+="<div class='media-body'>";output+="<span class='d-inline-block d-sm-none'>Block</span> <a href='/block/"+height+"'>"+height+"</a>";output+="<span class='d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap' id='cd"+height+"' data-countdown='"+age+"'></span>";output+="</div>";output+="</div>";output+="</div>";output+="<div class='col-sm-8'>";output+="<div class='d-flex justify-content-between'>";output+="<div class='text-nowrap'>";output+="<span class='d-block mb-1 mb-sm-0'>";if(strTagName!==''){output+="Validated By"+" <a class='hash-tag text-truncate' href='/address/"+miner+"'>"+strTagName+"</a>";}else{output+="Validated By"+" <a class='hash-tag text-truncate' href='/address/"+miner+"'>"+miner+"</a>";}
output+="</span>";if(noOfTransactions==0){output+="0 "+lang_txns+"<span class='small text-secondary ml-1'>"+lang_in_X+" "+strBlockTime+" "+(strBlockTime==="1"?(lang_sec+lang_sec_in):(lang_secs+lang_sec_in))+"</span>";}else{output+="<a href='/txs?block="+height+"' title='Transactions in this Block'>"+noOfTransactions+" "+lang_txns+"</a>  <span class='small text-secondary'>"+lang_in_X+" "+strBlockTime+" "+(strBlockTime==="1"?(lang_sec+lang_sec_in):(lang_secs+lang_sec_in))+"</span>";}
output+="<span class='d-inline-block d-sm-none'>";output+="<span class='u-label u-label--xs u-label--badge-in u-label--secondary text-center text-nowrap' title='Block Reward'>";output+=blockReward.replace("MATIC",lang_ether);output+="</span>";output+="</span>";output+="</div>";output+="<div class='d-none d-sm-block'>";output+="<span class='u-label u-label--xs u-label--badge-in u-label--secondary text-center text-nowrap' title='Block Reward'>";output+=blockReward.replace("MATIC",lang_ether);output+="</span>";output+="</div>";output+="</div>";output+="</div>";output+="</div>";output+="<hr class='hr-space'>";return output.toString();}
function inserttransaction(txhash,strFrom,strTo,strcontractAddress,value,age,strColor){var output;output="<div class='row'>";output+="<div class='col-sm-4'>";output+="<div class='media align-items-sm-center mr-4 mb-1 mb-sm-0'>";output+="<div class='d-none d-sm-flex mr-2'>";output+="<span class='btn btn-icon btn-soft-secondary rounded-circle'>";output+="<span class='btn-icon__inner text-dark'>"+lang_tx+"</span>";output+="</span>";output+=" </div>";output+=" <div class='media-body'>";output+="<span class='d-inline-block d-sm-none mr-1'>"+lang_tx+"#</span>";output+="<a class='hash-tag hash-tag--xs hash-tag-xs-down--md text-truncate' href='/tx/"+txhash+"'>"+txhash+"</a>";output+="<span class='d-none d-sm-block small text-secondary'><div  id='cd"+txhash+"' data-countdown='"+age+"'></div></span>";output+="</div>";output+="</div>";output+="</div>";output+="<div class='col-sm-8'>";output+="<div class='d-sm-flex justify-content-between'>";output+="<div class='text-nowrap mr-4 mb-1 mb-sm-0'>";output+="<span>"+lang_from+" <a class='hash-tag text-truncate' href='/address/"+strFrom+"'>"+strFrom+"</a></span>";if(strcontractAddress===""){output+="<span class='d-sm-block'>"+lang_to+" <a href='/address/"+strTo+"' class='hash-tag hash-tag--sm text-truncate'>"+strTo+"</a></span>";}else{output+="<span class='d-sm-block'>"+lang_to+" [<a href='/address/"+strcontractAddress+"' class='hash-tag hash-tag--sm text-truncate'>NewContract</a>]</span>";}
output+="</div>";output+="<div>";output+=" <span class='u-label u-label--xs u-label--badge-in u-label--secondary text-center text-nowrap' title='Amount'>";output+=value.replace("MATIC",lang_ether);output+="</span>";output+="</div>";output+="</div>";output+="</div>";output+="</div>";output+="<hr class='hr-space'>";return output.toString();}
function stopTimerAll(){$('[data-countdown]').each(function(){var $this=$(this);$this.countdown('stop');});}
function startTimerAll(){$('[data-countdown]').each(function(){var $this=$(this),finalDate=new Date().getTime()-$(this).data('countdown');$this.countdown(finalDate,{elapse:true}).on('update.countdown',function(event){var hours=event.offset.hours;var minutes=event.offset.minutes;var seconds=event.offset.seconds;if(hours>0){$this.html(event.strftime('%-H hr%!H %-M '+(minutes<=1?lang_min:lang_mins)+' %-S '+(seconds<=1?lang_sec:lang_secs)));}else if(minutes>0){$this.html(event.strftime('%-M '+(minutes<=1?lang_min:lang_mins)+' %-S '+(seconds<=1?lang_sec_ago:lang_secs_ago)));}else{$this.html(event.strftime('%-S '+(seconds<=1?lang_sec_ago:lang_secs_ago)));}});});}
function startstopwatch(intmslapsed,elementname){var fiveSeconds=new Date().getTime()-intmslapsed;$("#"+elementname).countdown(fiveSeconds,{elapse:true}).on('update.countdown',function(event){var $this=$(this);var hours=event.offset.hours;var minutes=event.offset.minutes;var seconds=event.offset.seconds;if(hours>0){$this.html(event.strftime('%-H hr%!H %-M '+(minutes<=1?lang_min:lang_mins)+' %-S '+(seconds<=1?lang_sec:lang_secs)));}else if(minutes>0){$this.html(event.strftime('%-M '+(minutes<=1?lang_min:lang_mins)+' %-S '+(seconds<=1?lang_sec_ago:lang_secs_ago)));}else{$this.html(event.strftime('%-S '+(seconds<=1?lang_sec_ago:lang_secs_ago)));}});}});function pinger(ws){var timer=setInterval(function(){if(ws.readyState==1){ws.send(JSON.stringify({event:"ping"}));}},60000);return{stop:function(){clearInterval(timer);}};}