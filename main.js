var app = new Vue({
    el: '#app',
    data() {
        return {
            message: "Bienvenue!",
            close: false,
            inputFrom: '',
            inputTo: '',
            choiceFrom: {},
            choiceTo: {},
            populars: [],
            optionsFrom: [],
            optionsTo: [],
            notice_a: '',
            notice_b: ''
        }
    },
    methods: {
        /*
        Fetch the Top 10 popular cities and load them as available options
        */
        init: function() {
            var vm = this;
            axios.get('https://www-uat.tictactrip.eu/api/cities/popular/10')
                .then((response) => {
                    vm.populars = response.data;
                    // Assign shalow copy of popular cities
                    vm.optionsFrom = vm.populars.slice();
                    vm.optionsTo = vm.populars.slice();
                })
                .catch((err) => {
                    vm.message = 'Something went wrong..' + err;
                })
        },
        cityName: function(val) {
            return _.upperFirst(val.unique_name);
        },
        // Choice validation
        isValid: function(choice) {
            // More advanced validation logic goes here!
            return !_.isArray(choice);
        },
        setChoiceFrom: function(choice) {
            var vm = this;
            if (vm.isValid(choice)) {
                vm.choiceFrom = choice;
                vm.inputFrom = vm.cityName(choice);
            }
        },
        setChoiceTo: function(choice) {
            var vm = this;
            if (vm.isValid(choice)) {
                vm.choiceTo = choice;
                vm.inputTo = vm.cityName(choice);
            }
        },
        // Autocomplete promise
        lookupOptions: function(query) {
            var vm = this;
            return axios.get('https://www-uat.tictactrip.eu/api/cities/autocomplete/?q=' + query);
        },
        // Update destination suggestions based on user depart
        refreshOptionsTo: function(choiceFrom) {
            var vm = this;
            axios.get('https://www-uat.tictactrip.eu/api/cities/popular/from/' + vm.cityName(choiceFrom) + '/5')
                .then((response) => {
                    var limit = 10; // How many 
                    var populars = vm.populars.slice(); // TOP 10 populars cities
                    var options = response.data; // TOP 5 custom destinations
                    vm.optionsTo = _.unionWith(options, populars, function(arrVal, othVal) {
                        return vm.cityName(arrVal) === vm.cityName(othVal); // comparator by city name for this example
                    }).slice(0, limit); // Merge and trim all available options
                    _.remove(vm.optionsTo, { unique_name: _.lowerCase(vm.cityName(choiceFrom)) }); // Clean up options
                })
        }
    },
    watch: {
        /* 
        Fireup autocomplete promise every time user input changes
        */
        inputFrom: _.debounce(function(newVal) {
            var vm = this;
            vm.notice_a = '';
            var query = _.trim(vm.inputFrom); // Clean user input before firing the call 
            if (query.length > 1) {
                vm.notice_a = 'Searching..';
                vm.lookupOptions(query)
                    .then((response) => {
                        if (_.isEmpty(response.data)) {
                            vm.optionsFrom = {};
                            vm.notice_a = 'Sorry, nothing found';
                        } else {
                            vm.optionsFrom = response.data;
                            vm.choiceFrom = _.head(vm.optionsFrom); // Optional
                            vm.notice_a = '';
                            return;
                        }
                    })
                    .catch((err) => {
                        vm.notice_a = 'API error: ' + err;
                    })
            } else {
                vm.optionsFrom = vm.populars.slice(); // RAZ
                vm.optionsTo = vm.populars.slice(); // RAZ
            }
        }, 500),

        inputTo: _.debounce(function(newVal) {
            var vm = this;
            vm.notice_b = '';
            var query = _.trim(vm.inputTo);
            if (query.length > 1) {
                vm.notice_b = 'Searching..';
                vm.lookupOptions(query)
                    .then((response) => {
                        if (_.isEmpty(response.data)) {
                            vm.optionsTo = {};
                            vm.notice_b = 'Sorry, nothing found';
                        } else {
                            vm.optionsTo = response.data;
                            vm.choiceTo = _.head(vm.optionsTo);
                            vm.notice_b = '';
                        }
                    })
                    .catch((err) => {
                        vm.notice_b = ['API error: ' + err];
                    })
            } else {
                vm.optionsTo = vm.populars.slice();
            }
        }, 700),
        // Refresh destinations
        choiceFrom: _.debounce(function() {
            var vm = this;
            if (vm.isValid(vm.choiceFrom)) {
                vm.refreshOptionsTo(vm.choiceFrom);
            }
        }, 500)
    },

    filters: {
        capitalize: function(value) {
            if (!value) return '';
            return _.upperFirst(value.unique_name);
        }
    },
    created: function() {
        this.init();
    }
})