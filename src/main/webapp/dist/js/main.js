(function () {
	'use strict';

	var main = angular.module('main', [
		'book',
		'author',
		'software',
		'ui.router',
		'ui.bootstrap',
		'ngResource',
		'ngAnimate',
		'pascalprecht.translate',
		'base64',
		'flow',
		'ngDialog'
		])
	.config(configure).
	run(run);


	configure.$inject = ['$stateProvider', '$urlRouterProvider', '$translateProvider'];
	function configure ($stateProvider, $urlRouterProvider, $translateProvider) {

		$urlRouterProvider.otherwise(function ($injector) {
			var $state = $injector.get("$state");
			$state.go('main.home');
		});

		$stateProvider
		.state('main', {
			url: '/',
			abstract: true,
			templateUrl: '/app/components/main/main.view.html',
			controller: 'SidebarCtrl'
		})
		.state('main.home', {
			url: 'home',
			views: {
				'': {
					templateUrl: '/app/components/home/home.view.html'
				}
			}
		});

		$translateProvider.useStaticFilesLoader({
            prefix: '/app/resources/lang/',
            suffix: '.json'
          });
	}

	function run($translate, $rootScope, $templateCache) {
		// $translate.use('en');
	}
})();

(function () {
	'use strict';

	angular
	.module('main')
	.controller('AuthorCtrl', AuthorCtrl);

	function AuthorCtrl($scope, $state, AuthorService, ngDialog) {
		var sc = $scope;
  
		sc.table = 'author';
		sc.base = '/' + sc.table;

		sc.currentDate = new Date().getFullYear();

		sc.getAge = function () {
			if (sc.birthday != '') alert(sc.birthday);
			else sc.age = null;
		}

		sc.tableHeader = 
		[
		'firstName', 
		'lastName',
		'email',
		'birthday'
		];

		sc.openEdit = function (id) {
			ngDialog.open({ 
				template: '/app/modules/author/action/author.action.view.html', 
				className: 'ngdialog-theme-dev',
				showClose: false,
				controller: 'AuthorEditCtrl',
				scope: $scope
			});
			sc.id = id;
		};

		sc.openAdd = function () {
			ngDialog.open({ 
				template: '/app/modules/author/action/author.action.view.html', 
				className: 'ngdialog-theme-dev',
				showClose: false,
				controller: 'AuthorNewCtrl',
				scope: $scope
			});
		};

		sc.openDelete = function (id) {
			sc.id = id;
			ngDialog.open({ 
				template: '/app/modules/author/action/author.action.delete.view.html', 
				className: 'ngdialog-theme-dev',
				showClose: false,
				controller: 'AuthorDeleteCtrl',
				scope: $scope
			});
		};

		sc.loadPage = function(currentPage, name, type) {
			AuthorService.getPage(currentPage - 1, 10, name, type)
			.success(function (data){
				sc.main = data;
			});
		};

		sc.loadPage(1); 
	};

})();

(function () {
	'use strict';

	var author = angular.module('author', [
		'ui.router'
		])
	.config(configure);


	configure.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
	function configure($locationProvider, $stateProvider, $urlRouterProvider) {

		$stateProvider
		.state('main.author', {
			url: 'author',
			abstract: true,
			template: '<div ui-view="content"></div>'
		})
		.state('main.author.table', {
			url: '', 
			views: {
				'content@main.author': {
					templateUrl: '/app/shared/table/table.view.html',
					controller: 'AuthorCtrl',
				},
				'filter@main.author.table': {
					templateUrl: '/app/modules/author/filter/author.filter.view.html'
				}
			}
		})
		.state('main.author.profile', { 
			url: '/:id',
			views: {
				'content@main.author': {
					templateUrl: '/app/modules/author/profile/author.profile.view.html',
					controller: 'AuthorProfileCtrl'
				}
			}
		});

	}

})();

(function () {
    'use strict';

    angular.module('main')
    .service('AuthorService', function ($http) {

        var urlBase = '/author';

        this.getAll = function () {
            return $http.get(urlBase);
        };

        this.get = function (id) {
            return $http.get(urlBase + '/' + id);
        };

        this.new = function (license) {
            return $http.post(urlBase, license);
        };

        this.update = function (license) {
            return $http.put(urlBase, license)
        };

        this.delete = function (id) {
            return $http.delete(urlBase, { 
                    params: { 
                        id: id
                    }
                }); 
        };

        this.getPage = function (currentPage, size, name, type) {
            return $http.get(urlBase, { 
                    params: { 
                        page: currentPage, 
                        size: size ,
                        name: name,
                        type: type
                    }
            });
        };

    });

})();

(function () {
	'use strict';

	angular
	.module('main')
	.controller('BookCtrl', BookCtrl);

	function BookCtrl ($scope, $state, $http, $stateParams, ngDialog, BookService) {
		var sc = $scope;

		sc.table = 'book';
		sc.base = '/' + sc.table;

		sc.tableHeader = 
		[ 
		'nameBook', 
		'publisherYear',
		'countPages',
		'sizeFile',
		'addressFileOnDisk',
		'addressFileOnNet'
		];

		sc.openEdit = function (id) {
			ngDialog.open({ 
				template: '/app/modules/book/action/book.action.view.html', 
				className: 'ngdialog-theme-dev',
				showClose: false,
				controller: 'BookEditCtrl',
				scope: $scope
			});
			sc.id = id; 
		};

		sc.openAdd = function () {
			ngDialog.open({ 
				template: '/app/modules/book/action/book.action.view.html', 
				className: 'ngdialog-theme-dev',
				showClose: false,
				controller: 'BookNewCtrl',
				scope: $scope
			});
		};

		sc.openDelete = function (id) {
			sc.id = id; 
			ngDialog.open({ 
				template: '/app/modules/book/action/book.action.delete.view.html', 
				className: 'ngdialog-theme-dev',
				showClose: false,
				controller: 'BookDeleteCtrl',
				scope: $scope
			});
		};

		sc.loadPage = function(currentPage, name, country) {
			if (name == '') name = null;
			if (country == '') country = null;
			
			BookService.getPage(currentPage - 1, 10, name, country)
			.success(function (data){
				sc.main = data;
			});
		};

		sc.loadPage(1); 

		$http.get('app/shared/dropdown/countries/countries.json').success(function (data) {
			sc.countriesWithFlags = data;
		});		
	};
})();

(function () {
	'use strict';

	var book = angular.module('book', [
		'ui.router'
		])
	.config(configure);
 

	configure.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
	function configure($locationProvider, $stateProvider, $urlRouterProvider) {

		$stateProvider
		.state('main.book', {
			url: 'book',
			abstract: true,
			template: '<div ui-view="content"></div>'
		})
		.state('main.book.table', {
			url: '',
			views: {
				'content@main.book': {
					templateUrl: '/app/shared/table/table.view.html',
					controller: 'BookCtrl'
				},
				'filter@main.book.table': {
					templateUrl: '/app/modules/book/filter/book.filter.view.html'
				}

			}
		})
		.state('main.book.profile', { 
			url: '/:id',
			views: {
				'content@main.book': {
					templateUrl: '/app/modules/book/profile/book.profile.view.html',
					controller: 'BookProfileCtrl'
				}
			}
		});
	}

})();

(function () {
    'use strict';

    angular.module('main')
    .service('BookService', function ($http) {

        var urlBase = '/book';

        this.getAll = function () {
            return $http.get(urlBase, { 
                    params: { 
                        page: 0, 
                        size: 1000
                    }
                });
        };  

        this.get = function (id) {
            return $http.get(urlBase + '/' + id);
        };

        this.new = function (dev) {
            return $http.post(urlBase, dev); 
        };

        this.update = function (dev) {
            return $http.put(urlBase, dev)
        };

        this.delete = function (id) {
            return $http.delete(urlBase, { 
                    params: { 
                        id: id
                    }
                }); 
        };

        this.getPage = function (currentPage, size, name, country) {
            return $http.get(urlBase, { 
                    params: { 
                        name: name,
                        country: country,
                        page: currentPage, 
                        size: size 
                    }
            });
        };

        this.uploadImage = function (file, id) {
            var fd = new FormData();
            fd.append('file', file);

            return $http.post(urlBase + '/upload', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined },
                params: { id: id }
            });
        }

        this.getLogo = function (id) {
            return $http.get(urlBase + '/logo', { 
                    params: { 
                        id: id
                    }
            });
        }
    });

})();

(function () {
	'use strict';

	angular
	.module('main')
	.controller('SoftwareCtrl', SoftwareCtrl);

	function SoftwareCtrl ($scope, $state, SoftwareService, DeveloperService, LicenseService, ngDialog) {
		var sc = $scope;
		
		sc.table = 'software';
		sc.base = '/' + sc.table;

		sc.tableHeader = 
		[
		'name', 
		'version',
		'release',
		'developer',
		'license',
		'windows',
		'linux',
		'macOS'
		];

		sc.openEdit = function (id) {
			ngDialog.open({ 
				template: '/app/modules/software/action/software.action.view.html', 
				className: 'ngdialog-theme-dev',
				showClose: false,
				controller: 'SoftwareEditCtrl',
				scope: $scope
			});
			sc.id = id;
		};

		sc.openAdd = function () {
			ngDialog.open({ 
				template: '/app/modules/software/action/software.action.view.html', 
				className: 'ngdialog-theme-dev',
				showClose: false,
				controller: 'SoftwareNewCtrl',
				scope: $scope
			});
		};

		sc.openDelete = function (id) {
			sc.id = id; 
			ngDialog.open({ 
				template: '/app/modules/software/action/software.action.delete.view.html', 
				className: 'ngdialog-theme-dev',
				showClose: false,
				controller: 'SoftwareDeleteCtrl',
				scope: $scope
			});
		};

		sc.loadPage = function(currentPage, name, release, devName, licName) {
			if (release != null) {
				var date = new Date(release);
				release = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
			}

			SoftwareService.getPage(currentPage - 1, 10, name, release, devName, licName)
			.success(function (data){
				sc.main = data;
			});
		};

		sc.devName = {};
		sc.licName = {};

		DeveloperService.getAll().success( function (data) {
			sc.developers = data.content;
		});

		LicenseService.getAll().success( function (data) {
			sc.licensies = data.content;
		});

		sc.loadPage(1); 
	};

})();

(function () {
	'use strict';

	var software = angular.module('software', [
		'ui.router'
		])
	.config(configure);


	configure.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
	function configure($locationProvider, $stateProvider, $urlRouterProvider) {

		$stateProvider
		.state('main.software', {
			url: 'software',
			abstract: true,
			template: '<div ui-view="content"></div>'
		})
		.state('main.software.table', {
			url: '', 
			views: {
				'content@main.software': {
					templateUrl: '/app/shared/table/table.view.html',
					controller: 'SoftwareCtrl',
				},
				'filter@main.software.table': {
					templateUrl: '/app/modules/software/filter/software.filter.view.html'
				}
			}
		})
		.state('main.software.profile', { 
			url: '/:id',
			views: {
				'content@main.software': {
					templateUrl: '/app/modules/software/profile/software.profile.view.html',
					controller: 'SoftwareProfileCtrl'
				}
			}
		});
	}

})();

(function () {
    'use strict';

    angular.module('main')
    .service('SoftwareService', function ($http) {

        var urlBase = '/soft';

        this.getAll = function () {
            return $http.get(urlBase, { 
                    params: { 
                        page: 0, 
                        size: 1000
                    }
                });
        };

        this.get = function (id) {
            return $http.get(urlBase + '/' + id);
        };

        this.new = function (software) {
            return $http.post(urlBase, software);
        };

        this.update = function (software) {
            return $http.put(urlBase, software)
        };

        this.delete = function (id) {
            return $http.delete(urlBase, { 
                    params: { 
                        id: id
                    }
                }); 
        };

        this.getPage = function (currentPage, size, name, release, devName, licName) {
            return $http.get(urlBase, { 
                    params: { 
                        page: currentPage, 
                        size: size,
                        name: name,
                        release: release,
                        devName: devName,
                        licName: licName
                    }
            });
        };

        this.getImages = function (id) {
            return $http.get(urlBase + '/images', { 
                    params: { 
                        id: id
                    }
            });
        }

        this.deleteImageById = function (id) {
            return $http.delete(urlBase + '/images', { 
                    params: { 
                        id: id
                    }
            });
        }

    });

})();

(function () {
    'use strict';

    angular
    .module('main')
    .filter('phone', function () {
        return function (tel) {
            if (!tel) { return ''; }

            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var country, city, number;

            switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
            country = 1;
            city = value.slice(0, 3);
            number = value.slice(3);
            break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
            country = value[0];
            city = value.slice(1, 4);
            number = value.slice(4);
            break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
            country = value.slice(0, 3);
            city = value.slice(3, 5);
            number = value.slice(5);
            break;

            default:
            return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});

})();

(function () {
	'use strict';

	angular
	.module('main')
	.controller('SidebarCtrl', SidebarCtrl);

	function SidebarCtrl($scope, $location) {  
		var sc = $scope;   

        sc.location = function() {
            return $location.path();
        }    

    }
})();

(function () {
	'use strict';

	angular
	.module('main')
	.controller('TableCtrl', TableCtrl);

	function TableCtrl($scope, $state, $http) {  
		var sc = $scope;
		
    	sc.field = sc.tableHeader[0];

        sc.setField = function(field) {
            sc.field = field;
        }

        //Sort 
        sc.fieldName = undefined;
        sc.reverse = false;

        sc.sort = function(fieldName) {
            sc.reverse = (sc.fieldName === fieldName) ? !sc.reverse:false;
            sc.fieldName = fieldName;
        }

        sc.isSortUp = function(fieldName) {
        	return sc.fieldName === fieldName && !sc.reverse;
        };

        sc.isSortDown = function(fieldName) {
        	return sc.fieldName === fieldName && sc.reverse;
        };
    
    }
})();

(function () {
	'use strict';

	angular
	.module('main')
	.controller('TranslateCtrl', TranslateCtrl);

	function TranslateCtrl ($scope, $translate) {
		var sc = $scope;
		
		$translate.use('en');

		sc.setLang = function(language) {
			$translate.use(language.toString());
			alert();
		};
		
	};
})();

(function () {
	'use strict';

	angular
	.module('main')
	.controller('AuthorDeleteCtrl', AuthorDeleteCtrl);

	function AuthorDeleteCtrl ($scope, $state, $location, AuthorService) {
		var sc = $scope;
		var authorName;

		AuthorService.get(sc.id)
	  		.success( function (data) {
	  			authorName = data.firstName;
				sc.log = 'Are you sure you want to remove author ' + authorName + '?';
	  		});

		sc.delete = function () {
			AuthorService.delete(sc.id)
			.then(function successCallback(response) {
				sc.closeThisDialog(true);
				sc.loadPage(1);
			  }, function errorCallback(response) {
			    	sc.log = 'Author "'+ authorName +'" could not be deleted because is in use yet';
			  }); 

		}
	};
})();

(function () {
	'use strict';

	angular
	.module('main')
	.controller('AuthorEditCtrl', AuthorEditCtrl);

	function AuthorEditCtrl ($scope, $state, $location, AuthorService) {
		var sc = $scope;
		sc.action = 'edit';

		AuthorService.get(sc.id)
		.success(function (data) {
			sc.author = data;

			sc.id = sc.author.id;
			sc.firstName = sc.author.firstName;
			sc.lastName = sc.author.lastName;
			sc.email = sc.author.email;
			sc.birthday = new Date(sc.author.birthday);

			sc.save = function () {
				sc.author = {
					'id': sc.id,
					'firstName': sc.firstName,
					'lastName': sc.lastName,
					'email': sc.email,
					'birthday': sc.birthday.getFullYear() + '-' + sc.birthday.getMonth() + '-' + sc.birthday.getDate()
				}

				if (sc.firstName != '' 
					&& sc.lastName != ''
					&& sc.email != ''
					&& sc.birthday != ''
					&& sc.authorForm.$valid
				) {
					AuthorService.update(sc.author)
					.success(function (data) {
						sc.author = null;
						sc.closeThisDialog(true);
						sc.loadPage(1);
					});
				}
				else alert('Error');
			}
		});
	}
})();

(function () {
	'use strict';

	angular
	.module('main')
	.controller('AuthorNewCtrl', AuthorNewCtrl);

	function AuthorNewCtrl ($scope, $state, $location, AuthorService) {
		var sc = $scope;

		sc.action = 'Add';

		sc.firstName = '';
		sc.lastName = '';
		sc.email = '';
		sc.birthday = new Date();
		
		sc.save = function () {
			sc.author = {
				'firstName': sc.firstName,
				'lastName': sc.lastName,
				'email':sc.email,
				'birthday': sc.birthday.getFullYear() + '-' + sc.birthday.getMonth() + '-' + sc.birthday.getDate()
			}

			if (sc.firstName != '' 
				&& sc.lastName != ''
				&& sc.email != ''
				&& sc.birthday != ''
				&& sc.authorForm.$valid
				) {
				AuthorService.new(sc.author)
				.success(function (data) {
					sc.author = null;
					sc.closeThisDialog(true);
					sc.loadPage(1);
				});
			}
			else alert('Error');
		}
	};
})();

(function () {
	'use strict';

	angular
	.module('main')
	.controller('BookDeleteCtrl', BookDeleteCtrl);

	function BookDeleteCtrl ($scope, $state, $location, BookService) {
		var sc = $scope;
		var bookName;

		BookService.get(sc.id)
	  		.success( function (data) {
	  			bookName = data.bookName;
				sc.log = 'Are you sure you want to remove book ' + bookName + '?';
	  		});

		sc.delete = function () {
			BookService.delete(sc.id)
			.then(function successCallback(response) {
				sc.closeThisDialog(true);
				sc.loadPage(1);
			  }, function errorCallback(response) {
			    	sc.log = 'Book "' + bookName + '" could not be deleted because is in use yet';
			  }); 
		}
	};
})();

(function () {
	'use strict';

	angular
	.module('main')
	.controller('BookEditCtrl', BookEditCtrl);

	function BookEditCtrl ($scope, $state, $location, BookService) {
		var sc = $scope;

		sc.action = 'edit';

		sc.target = { 
				target: '/dev/logo?id=' + sc.id,
				testChunks: false,
				singleFile: true
			};

		BookService.get(sc.id)
		.success(function (data) {
			sc.book = data;

			sc.id = sc.book.id;
			sc.nameBook = sc.book.nameBook;
			sc.publisherYear = new Date(sc.book.publisherYear);
			sc.countPages = sc.book.countPages;
			sc.sizeFile = sc.book.sizeFile;
			sc.addressFileOnDisk = sc.book.addressFileOnDisk;
			sc.addressFileOnNet = sc.book.addressFileOnNet;
 
			sc.save = function () {
				sc.book = {
					'nameBook': sc.nameBook,
	                'publisherYear': sc.publisherYear,
	                'countPages': sc.countPages,
	                'sizeFile': sc.sizeFile,
	                'addressFileOnDisk': sc.addressFileOnDisk,
	                'addressFileOnNet': sc.addressFileOnNet
				}

				if (sc.nameBook != '' 
	            	&& sc.publisherYear != '' 
	            	&& sc.countPages != '' 
	            	&& sc.sizeFile != '' 
	            	&& sc.addressFileOnDisk != '' 
	            	&& sc.addressFileOnNet != '' 
            	) {
	                BookService.update(sc.book)
						.success(function() {
						    sc.closeThisDialog(true);
						    sc.loadPage(1);
						});
            	} else alert('Error');
			}
		});
	}
})();

(function() {
    'use strict';

    angular
    .module('main')
    .controller('BookNewCtrl', BookNewCtrl);

    function BookNewCtrl($scope, $state, $location, $document, BookService) {
        var sc = $scope;

        sc.action = 'add';

        sc.nameBook = ''; 
        sc.publisherYear = new Date();
        sc.countPages = '';
        sc.sizeFile = '';
        sc.addressFileOnDisk = '';
        sc.addressFileOnNet = '';

        sc.save = function() {
            sc.developer = {
                'nameBook': sc.nameBook,
                'publisherYear': sc.publisherYear.getFullYear() + '-' + sc.publisherYear.getMonth() + '-' + sc.publisherYear.getDate(),
                'countPages': sc.countPages,
                'sizeFile': sc.sizeFile,
                'addressFileOnDisk': sc.addressFileOnDisk,
                'addressFileOnNet': sc.addressFileOnNet
            };

            if (sc.nameBook != '' 
            	&& sc.publisherYear != '' 
            	&& sc.countPages != '' 
            	&& sc.sizeFile != '' 
            	&& sc.addressFileOnDisk != '' 
            	&& sc.addressFileOnNet != '' 
            ) {
                BookService.new(sc.developer)
					.success(function() {
					    sc.closeThisDialog(true);
					    sc.loadPage(1);
					});
            } else alert('Error');
        };

    };
})();

(function () {
	'use strict';

	angular
	.module('main')
	.controller('BookProfileCtrl', BookProfileCtrl);

	function BookProfileCtrl ($scope, $state, $stateParams, ngDialog, BookService) {
		var sc = $scope;
		sc.table = 'book';

		sc.id = $stateParams.id;

		sc.target = { 
				target: '/dev/logo?id=' + $stateParams.id,
				testChunks: false,
				singleFile: true
			};

		BookService.get($stateParams.id)
	  		.success( function (data) {
	  			sc.profile = data;
	  		});

	  	sc.getLogoById = function (id) {
	  		BookService.getLogo(id)
	  		.success( function (data) {
	  			sc.devLogo = '';
	  			sc.devLogo = data;
	  		});
	  	}

	  	sc.openLogoUpload = function () {
	  		ngDialog.open({ 
				template: '/app/modules/book/profile/book.logo.upload.view.html', 
				className: 'ngdialog-theme-default',
				showClose: true,
				scope: $scope
			});
	  	}

	  	sc.getLogoById(sc.id);

	};
})();

(function () {
	'use strict';

	angular
	.module('main')
	.controller('SoftwareDeleteCtrl', SoftwareDeleteCtrl);

	function SoftwareDeleteCtrl ($scope, $state, $location, SoftwareService) {
		var sc = $scope;

		sc.delete = function () {
			SoftwareService.delete(sc.id)
			.success(function (data) {
				sc.loadPage(1);
				sc.closeThisDialog(true);
			});
		}
	};
})();

(function () {
	'use strict';

	angular
	.module('main')
	.controller('SoftwareEditCtrl', SoftwareEditCtrl);

	function SoftwareEditCtrl ($scope, $state, $location, SoftwareService, DeveloperService, LicenseService) {
		var sc = $scope;

		sc.action = 'Edit';

		SoftwareService.get(sc.id)
		.success(function (data) {
			sc.software = data;

			sc.id = sc.software.id;
			sc.name = sc.software.name;
			sc.version = sc.software.version;
			sc.releaseValue = sc.software.release;
			sc.license = sc.software.license;
			sc.developer = sc.software.developer;
			sc.windows = sc.software.windows;
			sc.linux = sc.software.linux;
			sc.macOS = sc.software.macOS;

			sc.release = new Date(sc.software.release);

			sc.selDeveloper = sc.software.developer;
			sc.selLicense = sc.software.license;

			DeveloperService.getAll().success( function (data) {
				sc.developers = data.content;
			});

			LicenseService.getAll().success( function (data) {
				sc.licensies = data.content;
			});

			sc.save = function () {
				sc.soft = {
					'id': sc.id,
					'name': sc.name,
					'version': sc.version,
					'release': sc.release.getFullYear() + '-' + (sc.release.getMonth() + 1) + '-' + sc.release.getDate(),
					'license': sc.selLicense,
					'developer': sc.selDeveloper,
					'windows': sc.windows,
					'linux': sc.linux,
					'macOS': sc.macOS
				}


			if (sc.name != '' 
				&& sc.version != ''
				&& sc.selDeveloper != {}
				&& sc.selLicense != {}
				) {
					SoftwareService.update(sc.soft)
					.success(function (data) {
						sc.loadPage(1);
						sc.soft = null;
					});
					sc.closeThisDialog(true);
				}
			else alert('Error');
			}
		});
	}
})();

(function () {
	'use strict';

	angular
	.module('main')
	.controller('SoftwareNewCtrl', SoftwareNewCtrl);

	function SoftwareNewCtrl ($scope, $state, $location, SoftwareService, DeveloperService, LicenseService) {
		var sc = $scope;

		sc.action = 'Add';

		sc.name = '';
		sc.version = '';
		sc.release = new Date();
		sc.license = '';
		sc.windows = false;
		sc.linux = false;
		sc.macOS = false;
		sc.selDeveloper = '';
		sc.selLicense = '';

		DeveloperService.getAll().success( function (data) {
			sc.developers = data.content;
		});

		LicenseService.getAll().success( function (data) {
			sc.licensies = data.content;
		});

		sc.save = function () {

			sc.soft = {
				'name': sc.name,
				'version': sc.version,
				'license': sc.selLicense,
				'developer': sc.selDeveloper,
				'release': sc.release.getFullYear() + '-' + sc.release.getMonth() + '-' + sc.release.getDate(),
				'windows': sc.windows,
				'linux': sc.linux,
				'macOS': sc.macOS
			}

		if (sc.name != '' 
			&& sc.version != ''
				&& sc.selLicense != ''
				&& sc.selDeveloper != ''
				) {
				SoftwareService.new(sc.soft)
				.success(function (data) {
					sc.loadPage(1);
					sc.soft = null;
					sc.closeThisDialog(true);
				});
			}
			else alert('Error');
		}
	}
})();

(function () {
	'use strict';

	angular
	.module('main')
	.controller('SoftwareProfileCtrl', SoftwareProfileCtrl);

	function SoftwareProfileCtrl ($scope, $state, $stateParams, SoftwareService, DeveloperService, ngDialog) {
		var sc = $scope;
		sc.table = 'software';
		sc.imgIndex = 0;

		sc.target = { 
				target: '/soft/images?id=' + $stateParams.id,
				testChunks: false
			};

		sc.getImage = function (index) {
			sc.imgIndex = index;
		}

		sc.getImageId = function (index) {
			return sc.images[sc.imgIndex].id;
		}
 
		SoftwareService.get($stateParams.id)
	  		.success( function (data) {
	  			sc.profile = data;

	  			DeveloperService.getLogo(data.developer.id)
	  			.success( function (data) {
	  				sc.devLogo = data.logo;
	  			});
	  		});

	  	sc.getImages = function () {
	  		SoftwareService.getImages($stateParams.id)
	  		.success( function (data) {
	  			sc.images = data;
				if (sc.images != '') sc.currentImage = sc.images[0].image;
	  		});	  	
	  	}

	  	sc.openImageById = function (index) {
			ngDialog.open({ 
				template: '/app/shared/image/image.fullsreen.view.html', 
				className: 'ngdialog-theme-image-view',
				showClose: false,
				scope: $scope
			});
			sc.imgIndex = index;
		};

		sc.deleteImage = function (id) {
			SoftwareService.deleteImageById(id).success( function (data) {
	  			sc.getImages();
	  		});	 
		}

		sc.previousImage = function () {
			if (sc.imgIndex == 0) sc.imgIndex = sc.images.length;
			sc.imgIndex --;
		}

		sc.nextImage = function () {
			sc.imgIndex ++;
			if (sc.imgIndex == sc.images.length) sc.imgIndex = 0;
		}

	  	sc.getImages();
	};
})();
