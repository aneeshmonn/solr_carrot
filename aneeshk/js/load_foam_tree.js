function get_range_val(){var e=document.getElementById("myRange");document.getElementById("range_val").innerHTML=e.value}function get_solr_url(){var e="",t="",a="",r=$("#include_abstract").is(":checked"),o="",n="";return""!=document.getElementById("snippet").value&&(t="&"+document.getElementById("snippet").value),""!=document.getElementById("MaxWordsPerLabel").value&&(a="&STCClusteringAlgorithm.maxDescPhraseLength="+document.getElementById("MaxWordsPerLabel").value),1==r&&(o="&carrot.snippet=abstract_html_strip"),""!=document.getElementById("pat_ids").value&&(e=e+"&fq=pat_id:("+document.getElementById("pat_ids").value.replace(/,/g," OR ")+")"),""!=document.getElementById("portfolio_ids").value&&(e=e+"&fq=portfolio_ids:("+document.getElementById("portfolio_ids").value.replace(/,/g," OR ")+")"),host="prod-solr-node1:8080",collection="pat_cluster",query=document.getElementById("query").value,algorithm=document.getElementById("algorithm").value,cluster_size=document.getElementById("myRange").value,raw=document.getElementById("raw").value,"stc"==document.getElementById("algorithm").value?n="http://"+host+"/solr/"+collection+"/clustering?q="+query+e+t+"&clustering.engine=stc&STCClusteringAlgorithm.maxClusters="+cluster_size+"&rows="+raw+"&echoParams=all&wt=json&STCClusteringAlgorithm.ignoreWordIfInHigherDocsPercent=0.1&STCClusteringAlgorithm.maxPhraseOverlap=0.60"+a+o:"lingo"==document.getElementById("algorithm").value?n="http://"+host+"/solr/"+collection+"/clustering?q="+query+e+t+"&clustering.engine=lingo&LingoClusteringAlgorithm.desiredClusterCountBase="+cluster_size+"&rows="+raw+"&echoParams=all&wt=json&MinLengthLabelFilter.enabled=true&StopWordLabelFilter.enabled=true&NumericLabelFilter.enabled=true&QueryLabelFilter.enabled=true&GenitiveLabelFilter.enabled=true&CompleteLabelFilter.enabled=true&CaseNormalizer.dfThreshold=3"+o:"kmeans"==document.getElementById("algorithm").value&&(n="http://"+host+"/solr/"+collection+"/clustering?q="+query+e+t+"&clustering.engine=kmeans&BisectingKMeansClusteringAlgorithm.clusterCount="+cluster_size+"&rows="+raw+"&echoParams=all&wt=json&BisectingKMeansClusteringAlgorithm.maxIterations=25&TermDocumentMatrixBuilder.titleWordsBoost=2.0&CaseNormalizer.dfThreshold=3&BisectingKMeansClusteringAlgorithm.labelCount=1"+o),n}function check_algo(e){"stc"==e.value?(document.getElementById("MaxWordsPerLabel").style.display="inline",document.getElementById("l1").style.display="inline"):"lingo"!=e.value&&"kmeans"!=e.value||(document.getElementById("MaxWordsPerLabel").style.display="none",document.getElementById("l1").style.display="none")}function CreateTableFromJSON(e){uniq_data=uniq(e),$("#t1").DataTable({data:uniq_data,destroy:!0,columns:[{title:"patnum",data:"id",render:function(e,t,a,r){return e='<a target="_blank" href="http://st-analyst.rpxcorp.com/#/search/patent/'+e+'">'+e+"</a>"}},{title:"title",data:"title"}],scrollY:"70vh"})}function uniq(e){return Array.from(new Set(e))}function get_sorted_array(e,t){for(var a=[],r=0;r<e.length;r++)for(var o=0;o<t.length;o++)t[o]==e[r].id&&a.push({id:e[r].patnum,title:e[r].title});return a}var generate=function(e,t,a,r){if(0!=e){if(null!==a){var o='"'+a.split(",").join('" OR "')+'"';t+="&fq=id:("+o+")"}var n=[],l=[];return $.ajax({url:t,async:!1,type:"GET",dataType:"json",success:function(a){pat_data=a.response.docs,cluster_data=a.clusters;for(var r=cluster_data.length,o=0;o<r;o++){var s=cluster_data[o].docs.length>10,i=cluster_data[o].labels[0];n.push({label:i+"("+cluster_data[o].docs.length+")",docs:cluster_data[o].docs,expandable:s,weight:(s?r:1)*cluster_data[o].score,groups:generate(e-1,t,cluster_data[o].docs.toString())})}for(var u=0;u<pat_data.length;u++)l.push({id:pat_data[u].patnum,title:pat_data[u].title})}}),[n,l]}};$(document).ready(function(){var e=document.getElementById("myRange");document.getElementById("range_val").innerHTML=e.value,$(document).ajaxStart(function(){$(".img-fluid").show(),$("#main_c").css("opacity",.4)}),$(document).ajaxComplete(function(){$(".img-fluid").hide(),$("#main_c").css("opacity",1)});var t=get_solr_url();levels=1;var a=function(){var e,t,a,r,o,n,l=new Tooltip("Test",{auto:!0}),s=!1;function i(){l.hide(),s=!1,window.clearTimeout(e)}function u(){if(n&&n.label){for(var e=[],i=0;i<n.docs.length;i++)e.push(/:(.+)/.exec(n.docs[i])[1]);l.content("<b>"+n.tooltip_label+"</b>"),l.position(r,o),l.show(),t=r,a=o,s=!0}}return document.body.addEventListener("mousemove",function(n){r=n.pageX,o=n.pageY,s&&Math.sqrt(Math.pow(r-t,2)+Math.pow(o-a,2))>10&&i(),window.clearTimeout(e),e=window.setTimeout(u,500)}),{group:function(e){n=e},hide:i}}(),r=[],o=[];$.ajax({url:t,async:!0,type:"GET",dataType:"json",success:function(e){pat_data=e.response.docs,all_pat_data=pat_data,cluster_data=e.clusters;for(var n=cluster_data.length,l=0;l<n;l++){var s=cluster_data[l].docs.length>10&&get_sorted_array(all_pat_data,pat_data).length!=cluster_data[l].docs.length,i=cluster_data[l].labels[0]+"("+cluster_data[l].docs.length+")",u=i;r.push({label:i,tooltip_label:u,docs:cluster_data[l].docs,expandable:s,weight:(s?n:1)*cluster_data[l].score,groups:generate(levels-1,t,cluster_data[l].docs.toString())})}for(var d=0;d<pat_data.length;d++)o.push({id:pat_data[d].patnum,title:pat_data[d].title});CreateTableFromJSON(o);var c,g=new CarrotSearchFoamTree({id:"visualization",groupMinDiameter:0,groupLabelMinFontSize:3,groupBorderRadius:0,parentFillOpacity:.5,groupBorderWidth:2,groupInsetWidth:3,groupSelectionOutlineWidth:1,groupBorderWidthScaling:.25,dataObject:{groups:r},rolloutDuration:0,pullbackDuration:0,onGroupHold:function(e){e.secondary||!e.group.expandable||e.group.groups?this.open({groups:e.group,open:!e.secondary}):h.load(e.group)},onGroupHover:function(e){a.group(e.group)},onGroupMouseWheel:a.hide,onGroupExposureChanging:a.hide,onGroupOpenOrCloseChanging:a.hide,maxLabelSizeForTitleBar:0,onGroupDoubleClick:function(e){e.preventDefault();var t,a=e.secondary?e.bottommostOpenGroup:e.topmostClosedGroup;a?(CreateTableFromJSON(get_sorted_array(all_pat_data,a.docs)),e.secondary||!a.expandable||e.group.groups?this.open({groups:a,open:!e.secondary}):h.load(a),t=e.secondary?a.parent:a):t=this.get("dataObject"),this.zoom(t)},groupLabelDecorator:function(e,t,a){t.group.expandable&&!t.group.groups&&(a.labelText+=" »"),t.group.groups&&!1===t.browseable&&(a.labelText+=" »»")}});window.addEventListener("orientationchange",g.resize),window.addEventListener("resize",function(){window.clearTimeout(c),c=window.setTimeout(g.resize,300)}),$("button[name = 'visualize']").click(function(){t=get_solr_url();var e=[],a=[];$.ajax({url:t,async:!0,type:"GET",dataType:"json",success:function(r){pat_data=r.response.docs,all_pat_data=pat_data,cluster_data=r.clusters;for(var o=cluster_data.length,n=0;n<o;n++){var l=cluster_data[n].docs.length>10,s=cluster_data[n].labels[0]+"("+cluster_data[n].docs.length+")",i=s;a.push({label:s,tooltip_label:i,docs:cluster_data[n].docs,expandable:l,weight:(l?o:1)*cluster_data[n].score,groups:generate(levels-1,t,cluster_data[n].docs.toString())})}for(var u=0;u<pat_data.length;u++)e.push({id:pat_data[u].patnum,title:pat_data[u].title});g.set({dataObject:{groups:a}}),CreateTableFromJSON(e)}})});var p,m,h=(p=g,{load:function(e){e.groups||e.loading||(_.start(e),window.setTimeout(function(){if(null!==e.docs.toString()){var a='"'+e.docs.toString().split(",").join('" OR "')+'"';t=get_solr_url(),a=(a=JSON.stringify(a)).replace(/(^")|("$)/g,""),data_json='{filter:"id:('+a+')"}'}var r=e.tooltip_label;r=r;var o=[],n=[];$.ajax({url:t,async:!0,headers:{"Content-type":"text/json"},type:"POST",dataType:"json",data:data_json,crossDomain:!0,failure:function(e){},success:function(a){pat_data2=a.response.docs,cluster_data2=a.clusters;for(var l=cluster_data2.length,s=0;s<l;s++){var i=cluster_data2[s].docs.length>10&&get_sorted_array(all_pat_data,e.docs).length!=cluster_data2[s].docs.length,u=cluster_data2[s].labels[0];o.push({label:u+"("+cluster_data2[s].docs.length+")",tooltip_label:r+"&nbsp;&nbsp;--\x3e&nbsp;&nbsp;"+u+"("+cluster_data2[s].docs.length+")",docs:cluster_data2[s].docs,expandable:i,weight:(i?l:1)*cluster_data2[s].score,groups:generate(levels-1,t,cluster_data2[s].docs.toString())})}for(var d=0;d<pat_data2.length;d++)n.push({id:pat_data2[d].patnum,title:pat_data2[d].title});e.groups=o,CreateTableFromJSON(n),p.open({groups:e,open:!0}).then(function(){_.stop(e)})}})},500+1500*Math.random()))}}),_=((m=g).set("wireframeContentDecorationDrawing","always"),m.set("groupContentDecoratorTriggering","onSurfaceDirty"),m.set("groupContentDecorator",function(e,t,a){var r=t.group;if(r.loading){var o=t.polygonCenterX,n=t.polygonCenterY,l=t.context,s=Date.now(),i=.3;s-r.loadingStartTime<500&&(i*=Math.pow((s-r.loadingStartTime)/500,2)),(t.shapeDirty||void 0==r.spinnerRadius)&&(r.spinnerRadius=.4*CarrotSearchFoamTree.geometry.circleInPolygon(t.polygon,o,n));var u=2*Math.PI*(s%1e3)/1e3;l.globalAlpha=i,l.beginPath(),l.arc(o,n,r.spinnerRadius,u,u+Math.PI/5,!0),l.strokeStyle="black",l.lineWidth=.3*r.spinnerRadius,l.stroke(),m.redraw(!0,r)}}),{start:function(e){e.loading=!0,e.loadingStartTime=Date.now(),m.redraw(!0,e)},stop:function(e){e.loading=!1}})}})});