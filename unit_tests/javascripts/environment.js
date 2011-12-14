
var modules;
var allResults = [];
var current;

registerEnvironment = function(name, mod) {
  environment = name;
  modules = mod;
}

startTests = function() {
  jQuery(document).trigger('suite.started', [environment, modules]);
  nextModule();
}

testsFinishedCallback = function(r, time) {
  if(!current) console.info(r, time);
  var data = { module: current.name, results: r, time: time };
  jQuery(document).trigger('suite.module_finished', data);
  allResults.push(data);
  nextModule();
}

var nextModule = function() {
  current = modules.shift();
  if(current) {
    loadScripts(current);
  } else {
    modulesFinished();
  }
}

var modulesFinished = function() {
  jQuery(document).trigger('suite.finished', [environment, allResults]);
}

var loadScripts = function(module) {
  var loaded = 0, i;
  for(i = 0; i < module.tests.length; i++){
    jQuery.getScript((module.path || '') + module.tests[i], function(){
      loaded++;
      if(loaded == module.tests.length){
        syncTestsFinished();
      }
    });
  }
}
