'use strict';

visitNotesApp.controller('cloudController',
    function cloudController($scope, $location, DateFactory, SearchFactory, SofaDocumentResource, SofaDocumentResources, SofaTextMentionResource, SofaTextMentionResources){

        $scope.searchInput = "";
        $scope.searchTerms = [];
        
        $scope.addToSearch = function(name){
            console.log("Added to search: " + name);
            $scope.searchInput += " " + name;
            $scope.searchTerms.push(name);
        };

        $scope.page1Submit = function(searchInput){
        	
        	SearchFactory.setSearchTerms($scope.searchTerms);
            console.log("Page 1 submitted with searchInput: " + $scope.searchInput);
            console.log("Page 1 submitted with JSON.stringify(searchTerms): " + JSON.stringify($scope.searchTerms));
            //$location.path('/view2');
            $location.url('/view2');
        };
        
        $scope.entityTypes = [{"id": 0, "name": "Problems"}, {"id": 1, "name": "Treatments"}, {"id": 2, "name": "Tests"}];
        $scope.displayNumTerms = [{"id": 5, "name": "View 5"}, {"id": 10, "name": "View 10"}, {"id": 20, "name": "View 20"}, {"id": 30, "name": "View 30"}];

        $scope.entityTypes.selectedValue = "Problems";
        $scope.displayNumTerms.selectedValue = 5;
        
        $scope.entityType = 'All';
        $scope.numTerms = '20';
        
        function monthsBefore(d, months) {
  		  var nd = new Date(d.getTime());
  		  nd.setMonth(d.getMonth() - months);
  		  return nd;
  		}
        
        function formatDate(date) {
        	  
        	  var day = date.getDate();
        	  var month;
        	  if(date.getMonth() < 9){
        		  month = date.getMonth() + 1;
        		  month = "0" + month;
        	  }
        	  else {
        		  month = date.getMonth() + 1;
        	  }
        	  
        	  var year = date.getFullYear();

        	  return year + '-' + month + '-' + day;
        	}
  	
        function getParameterByName(name, url) {
            if (!url) {
              url = window.location.href;
            }
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
        
        function Word(name, className){
            this.name = name;
            this.className  = className;
            this.count = 1; // Assign that method as property.
         }
        
        function incrementCount(Word){
           Word.count++ ; 
         }
        
        function shuffle(array) {
            var counter = array.length;

            while (counter > 0) {
                let index = Math.floor(Math.random() * counter);
                counter--;
                var temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return array;
        }
        
        function finalCloudDisplay(results){
        	
        	if(typeof results  != 'undefined'){
        	var resultsarr = results;
			var clouddict = {};
			var tmp, tmpword ;

			for(var i=0; i<resultsarr.length; i++){
				tmp = resultsarr[i].display.split("/");
				if(tmp[0] in clouddict){
					incrementCount(clouddict[tmp[0]]);
				}
				else{
					clouddict[tmp[0]] = new Word(tmp[0], tmp[1]);
				}
			}
			
			var keysSorted = Object.keys(clouddict).sort(function(a,b){return clouddict[b].count-clouddict[a].count})
			
			var keysSelected;
			if (keysSorted.length > $scope.numTerms)
				keysSelected = keysSorted.slice(0, $scope.numTerms);
			else keysSelected = keysSorted;
			
			var keysShuffled = shuffle(keysSelected);
			
			var cloudSelected = [];
			for (var j=0; j<keysShuffled.length; j++){
				cloudSelected.push(clouddict[keysShuffled[j]]);
			};
			return cloudSelected;
        	}
        }
     
        $scope.selectEntityType = function(entity){
            console.log("Entity type selected: " + entity.name);
            $scope.entityType = entity.name;
        };

        $scope.selectDisplayNumTerms = function(term){
            console.log("Number of terms selected: " + term.id);
            $scope.numTerms = term.id;
        };
        
        //$scope.startDate = { "name": DateFactory.getSliderMinDate() };
        //$scope.endDate = { "name": DateFactory.getSliderMaxDate() };
      
        $scope.sliderMinDate = monthsBefore(new Date(), 24);
        $scope.sliderMaxDate = new Date();
        console.log('slider max: ' + $scope.sliderMaxDate);
        
        DateFactory.setSliderMinDate($scope.sliderMinDate);
        DateFactory.setSliderMaxDate($scope.sliderMaxDate);
        
        $scope.$watch('sliderMinDate', function (newValue, oldValue) {
            //if (newValue !== oldValue) {
            	DateFactory.setSliderMinDate(newValue);
            	//console.log("Slider min in sliderController: " + newValue);
            //}
            	$scope.sofatextmentions = SofaTextMentionResources.displayCloud({
    	 			startDate: formatDate(newValue),
    	 			endDate: formatDate($scope.sliderMaxDate),
    	 			entityType: $scope.entityType,
    	 			patient : $scope.patient
    			}, function() {
    				//console.log("After start date change:");
    				console.log('sofatextmentions:' + JSON.stringify($scope.sofatextmentions));
    				$scope.finalCloud = finalCloudDisplay($scope.sofatextmentions.results);
    				console.log('finalcloud: ' + JSON.stringify($scope.finalCloud));
    			});
        });
        
        $scope.$watch('sliderMaxDate', function (newValue, oldValue) {
            //if (newValue !== oldValue) {
            	DateFactory.setSliderMaxDate(newValue);
            	//console.log("Slider max in sliderController: " + newValue);
            //}
                	$scope.sofatextmentions = SofaTextMentionResources.displayCloud({
        	 			startDate: formatDate($scope.sliderMinDate),
        	 			endDate: formatDate(newValue),
        	 			entityType: $scope.entityType,
        	 			patient : $scope.patient
        			}, function() {
        				//console.log("After end date change:");
        				console.log('sofatextmentions:' + JSON.stringify($scope.sofatextmentions));
        				$scope.finalCloud = finalCloudDisplay($scope.sofatextmentions.results);
        				console.log('finalcloud: ' + JSON.stringify($scope.finalCloud));
        				});

        });
        
        $scope.patient = getParameterByName('patientId');
        
        //$scope.sofadoctest1 = SofaDocumentResource.get({ id: '1d840527-cef9-4a90-9f98-0ea9bffffe2f' }, function() {
        $scope.sofatextmention1 = SofaTextMentionResource.get(function() {
        	console.log($scope.sofatextmention1.mentionText);
          }); // get() returns a single entry

 
        $scope.sofatextmentions = SofaTextMentionResources.displayCloud({
	 			startDate: formatDate($scope.sliderMinDate),
	 			endDate: formatDate($scope.sliderMaxDate),
	 			entityType: $scope.entityType,
	 			patient : $scope.patient
			}, function() {
				console.log('sofatextmentions:' + JSON.stringify($scope.sofatextmentions));
				$scope.finalCloud = finalCloudDisplay($scope.sofatextmentions.results);
				console.log('finalcloud: ' + JSON.stringify($scope.finalCloud));
			});
        
        
        
        $scope.$watch('entityType', function(newVal, oldVal) {
            //if(newVal) {
            	$scope.sofatextmentions = SofaTextMentionResources.displayCloud({
    	 			startDate: formatDate($scope.sliderMinDate),
    	 			endDate: formatDate($scope.sliderMaxDate),
    	 			entityType: newVal,
    	 			patient : $scope.patient
    			}, function() {
    				console.log("After change:");
    				console.log($scope.sofatextmentions.results);
    				$scope.finalCloud = finalCloudDisplay($scope.sofatextmentions.results);
    				console.log('finalcloud: ' + JSON.stringify($scope.finalCloud));
    			});
           // }
          });

});