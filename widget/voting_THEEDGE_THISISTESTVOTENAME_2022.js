
// $(function () {
(function ($, undefined) {
    var headScript = document.createElement("script");
    window.submitClicked = false;
    headScript.src = "https://cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.load.min.js";
    document.getElementsByTagName('head')[0].appendChild(headScript);
    var stationDefaultImgUrl = "https://images.mediaworks.nz/edge/Content/apps/theme/images/theedge_square4x.png?width=400&height=400&crop=auto"
    headScript.onload = function () {
        // console.log('headScript onLoad starting');
        var resources = [];
        // resources.push('https://code.jquery.com/jquery-2.2.4.js');
        // resources.push('https://images.mediaworks.nz/countdown/voting_widget/css/form.css?ver=' + Date.now());
        // resources.push('https://images.mediaworks.nz/countdown/voting_widget/css/layout.css?ver=' + Date.now());
        // resources.push('https://images.mediaworks.nz/countdown/voting_widget/css/swiper.css?ver=' + Date.now());
        resources.push('https://unpkg.com/swiper/swiper-bundle.min.css');
        resources.push('https://unpkg.com/swiper/swiper-bundle.min.js');
        resources.push('https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css');
        resources.push('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
        resources.push('https://code.jquery.com/ui/1.12.1/jquery-ui.min.js');
        resources.push('https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js');
        resources.push('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js');
        head.load(resources, function () {
            run();
        });
    }

    function run() {
        var serverEndpoint = "https://radio-api.mediaworks.nz";
        var songsEndpoint = serverEndpoint + "/comp-api/v1/songs/theedge";
        var allSongs, delayTimer = null;
        var entries = [];
        var loggedinUserID = "_";
        var loggedinAge = "_";
        var loggedinBirthYear = "_";
        var loggedinEmail = "_";
        var loggedinFirstName = "_";
        var loggedinGender = "_";
        var loggedinLastName = "_";
        var loggedinZip = "_";
        var loggedinPhone = "_";
        var minSongsSelected = 1;
        var maxSongsSelected = 8;
        var hasAlreadySubmitted = false;
        var formId = "TESTVOTENAME123";
        var tAndC = "NO";

        const loginRequired = false;
        const needPromoDate = false;

        // share image config
        const shareImgGeneralTextLayout = 1; // 1 = one column, 2 = 2 columns
        const shareImgSongAndArtistTextLayout = 1; // 1 = in one line, 2 = in 2 lines
        const shareImgArtistFontColor = "#fffff";
        const shareImgSongFontColor = "#ffffff";
        const shareImgFontSize = "32px";
        const shareImgfontFamily = "PlatformBold";
        const shareImgSongAndArtistMaxLength = 450;
        const shareImgFirstVoteXCoordinate = 600;
        const shareImgFirstVoteYCoordinate = 400;
        const shareImgVoteSpacing = 75;
        const shareImgTextFontStyle = shareImgFontSize + " " + shareImgfontFamily;



        $.getJSON(songsEndpoint).then(function (songs) {
            allSongs = songs;
            var filteredSongs = filterAllSongs("SONG", "#", "startsWith");
            showFilteredSongs("SONG", filteredSongs);
        });

        $('.message.voting__message').hide();

        if (!needPromoDate) {
        $('.checkbox__wrapper').hide();
        }

        $('.share').hide();
        var swiper = new Swiper(".mySwiper", {
            // slidesPerView: 4.8,
            scrollbar: {
                el: ".swiper-scrollbar",
                hide: false,
                draggable: true
            },
            // touchReleaseOnEdges: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            // observer: true,
            breakpoints: {
                200: {
                    slidesPerView: 2.5,
                    spaceBetween: 20, 
                    scrollbar: {
                        dragSize: 75
                    }
                },
                429: {
                    slidesPerView: 3.4,
                    spaceBetween: 20,
                    scrollbar: {
                        dragSize: 90
                    }
                },
                769: {
                    slidesPerView: 4.8,
                    spaceBetween: 20,
                    scrollbar: {
                        dragSize: 151
                    }
                }
            }
        });
        loadSlides(1, maxSongsSelected);

        var $tabs = $('.tabs__list .tabs__tab');

        $tabs.click(function (event) {
            var selectedClass = 'is-tab-selected';
            $tabs.removeClass(selectedClass);
            $(event.target).addClass(selectedClass);
            $(".tabs__body>div:not('.songs')").hide();
            $('#body__' + event.target.id).css("display", "block");
            //search tab
            if (event.target.id === "browse") {
                var value = $('#slider').slider('value')
                var term = ""
                if (value == 1) term = String.fromCharCode(value + 34); // for # sign
                else term = String.fromCharCode(value + 63);
                var filter = $('input[name="browseRadio"]:checked').val(); //SONG OR ARTIST
                var filteredSongs = filterAllSongs(filter, term, "startsWith");
                showFilteredSongs(filter, filteredSongs);
            } else if (event.target.id === "search") {
                var searchTerm = $('#searchTerm').val();
                searchTerm = searchTerm.trim();
                if (searchTerm.length >= 2) {
                    var filter = $('input[name="searchRadio"]:checked').val(); //SONG OR ARTIST
                    var filteredSongs = filterAllSongs(filter, searchTerm, "contains");
                    displaySongs(filter, filteredSongs);
                } else {
                    $('.songs > .song').addClass('hidden');
                }
            } else {
                //Add your own tab
                var inputTerm = $('#inputAddSongTitle').val();
                if (inputTerm.length >= 2) {
                    var filteredSongs = filterAllSongs("SONG", inputTerm, "contains");
                    showFilteredSongs("SONG", filteredSongs);
                } else {
                    $('.songs > .song').addClass('hidden');
                }
            }
        });

        var handle = $("#custom-handle");
        $("#slider").slider({
            min: 1,
            max: 27,
            create: function () {
                handle.text(String.fromCharCode(35));
            },
            change: function (event, ui) {
                var term = ""
                if (ui.value == 1) term = String.fromCharCode(ui.value + 34); // for # sign
                else term = String.fromCharCode(ui.value + 63);
                var filter = $('input[name="browseRadio"]:checked').val(); //SONG OR ARTIST
                var filteredSongs = filterAllSongs(filter, term, "startsWith");
                showFilteredSongs(filter, filteredSongs);
            },
            slide: function (event, ui) {
                if (ui.value == 1) handle.text(String.fromCharCode(ui.value + 34))
                else handle.text(String.fromCharCode(ui.value + 63));
            }
        });

        $("input[name='browseRadio']").change(function () {
            $('#slider').slider('value', 1)
            $("#custom-handle").text("#");
            if ($(this).val() === 'ARTIST') {
                var filteredSongs = filterAllSongs("ARTIST", "#", "startsWith");
                showFilteredSongs("ARTIST", filteredSongs);
            } else if ($(this).val() === 'SONG') {
                var filteredSongs = filterAllSongs("SONG", "#", "startsWith");
                showFilteredSongs("SONG", filteredSongs);
            }
        });

        $("#submitVotes").click(function () {
            if(hasAlreadySubmitted) {
                warningOutput("You have already submitted an entry.", 5000);
                return;
            }
            //warn user if they didn't select all songs
            if (window.submitClicked == false && entries.length < maxSongsSelected) {
                var songsLeft = maxSongsSelected - entries.length;
                var songsleft_S = "";
                if (songsLeft > 1) {
                    songsleft_S = "s"
                }
                var SubmitMessage = "Are you sure you want to submit? You can select " + songsLeft + " more song" + songsleft_S + ". Pick carefully though - you can only submit once!"
                window.submitClicked = true;
                warningOutput(SubmitMessage, 5000);
            } else {
                if(loginRequired){
                    //check if user is logged in
                    if (isLoggedIn()) {
                        //check if the user has already submitted an entry
                        verifyAndSubmitUserEntry();
                    } else {
                        //display login screen
                        // console.log('user not logged in');
                        window.submitClicked = true;
                        FBW.Firebase.Login.show();
                        //once logged in
                        // if (submitClicked) verifyAndSubmitUserEntry();
                    }
                } else {
                    //submit entry
                    submitEntry();
                }
            }
        });

        /**
        * Deal with changes when firebase status has been loaded
        */
        $(document).on('fb-auth-state-known', function (authInfo) {
            if (isLoggedIn()) {
                if (window.submitClicked) {
                    verifyAndSubmitUserEntry();
                } else {
                    var profile = FBW.Service.getProfile();
                    var resultEndpoint = serverEndpoint + "/comp-api/v1/check/entry/" + profile.uid + "?formId=" + formId;
                    $.getJSON(resultEndpoint)
                        .done(function (data) {
                            if (data && data.userData) {
                                hasAlreadySubmitted = true;
                                warningOutput("You have already submitted an entry.", 5000);
                            } else {
                                hasAlreadySubmitted = false;
                            }
                        });
                }
            }
        });

        function isLoggedIn() {
            return (typeof FBW !== "undefined" && FBW.Service && FBW.Service.getUser() !== null);
        }

        function verifyAndSubmitUserEntry() {
            var profile = FBW.Service.getProfile();//{ name: { first: 'test1', last: 'last' }, uid: 'xxx', mobilephone: 'x234343' };
            var user = FBW.Service.getUser();//{ email: 'test@test.com' };//FBW.Service.getUser(); 
            if (profile.uid) loggedinUserID = profile.uid;
            if (profile.birth && profile.birth.year) {
                loggedinAge = moment().format('YYYY') - parseInt(profile.birth.year);
                loggedinBirthYear = profile.birth.year;
            }
            if (user && user.email) loggedinEmail = user.email;
            var name = profile.name;
            if (name && name.first) loggedinFirstName = name.first;
            if (name && name.last) loggedinLastName = name.last;
            if (profile.gender) loggedinGender = profile.gender;
            if (profile.address && profile.address.postcode) loggedinZip = profile.address.postcode;
            if (profile.mobilephone) loggedinPhone = profile.mobilephone;

            var resultEndpoint = serverEndpoint + "/comp-api/v1/check/entry/" + profile.uid + "?formId=" + formId;
            $.getJSON(resultEndpoint)
                .done(function (data) {
                    // if (loggedinEmail === "supertester@mailinator.com") {
                    //     submitEntry(); return;
                    // }
                    if (data && data.userData) {
                        warningOutput("You have already submitted an entry.", 5000);
                    } else {
                        //submit entry
                        submitEntry();
                    }
                });
        }

        function submitEntry() {
            if (entries.length > 0) {

                if(document.getElementById('tAndC').checked){
                    tAndC = "YES";        
                }

                var apiSend = {
                    formId: formId,
                    formConfig: {
                        maxEntries: 1
                    },
                    userData: {
                        gigyaUserId: loggedinUserID,
                        age: loggedinAge,
                        birthYear: loggedinBirthYear,
                        email: loggedinEmail,
                        firstName: loggedinFirstName,
                        gender: loggedinGender,
                        lastName: loggedinLastName,
                        zip: loggedinZip,
                        phone: loggedinPhone,
                        // region: $('#userRegion').val(),
                        // promo: $('#promo').val(),
                        tAndCOption: tAndC
                    },
                    formData: {
                        entries: entries
                    }
                };

                generateSocialImage1200(entries, '.share__artwork')

                var resultEndpoint = serverEndpoint + "/comp-api/v1/save/form/entry"

                $.ajax({
                    url: resultEndpoint,
                    type: 'POST',
                    data: apiSend,
                    //headers: {Authorization: 'Bearer ' + FBW.Service.getJwt()},
                    success: function (data, textStatus, xhr) {
                        $(".voting").hide(1000);
                        buildAndShowShareScreen();
                        //clear the entries
                        console.log("Vote entries sent："+ xhr.status)

                        entries = [];
                        window.submitClicked = false;

                        // $(".share").show();

                        // $('#endscreenMessage').html('Thank you for submitting your entry!<br/><br/>Here's a sweet image of your votes. Simply click the share button to share right now on Facebook or download the image to upload yourself.').show();
                    },
                    failure: function () {
                        warningOutput('Oops! Something went wrong. Please try again later.', 5000);
                    }
                });
            }
            else {
                warningOutput('Please select songs first', 3000)
            }
        }

        function buildAndShowShareScreen() {
            var headerImages = []
            $.each(entries, function (i, entry) {
                var artwork = entry.ARTWORK;
                var imgDiv = '<img src="' + artwork + '"/>'
                headerImages.push(imgDiv);
            })
            $(".share__header").append(headerImages);

            $(".share").show();
        }

        $(document).on('click', '.slide__artwork:not(".slide__artwork--added")', function () {
            $('html,body').animate({
                scrollTop: $(".songs").offset().top
            }, 1000);
        });

        function loadSlides(index, total) {
            var slides = [];
            for (var i = 0; i < total; i++) {
                var slide = '<div class="swiper-slide">' +
                    '<div class="slide swiper__slide" style="background-color: white; padding-top: 0px;">' +
                    '<div class="slide__artwork"><img class="slide__placeholder" src="https://images.mediaworks.nz/countdown/voting_widget/img/plusicon.png" /></div>' +
                    '<div class="slide__number">' + index++ + '</div>' +
                    '<div class="slide__song">Song Title</div>' +
                    '<div class="slide__artist">Artist Name</div>' +
                    '</div>' +
                    '</div>';
                slides.push(slide);
            }
            swiper.appendSlide(slides);
            swiper.update();
        }

        //Add Song
        $(document).on('click', '.song .button--enabled.add', function () {

            var el = $(this);
            var artwork = el.siblings().find($('.song__artwork img')).attr('src');
            var title = el.siblings().find($('.song__detail .song__title')).text();
            var artist = el.siblings().find($('.song__detail .song__artist')).text();
            var added = addSong(artwork, title, artist, "FROM LIST");
            if (added) {
                //replace add song button with remove
                var removeButton = getRemoveButton();
                el.replaceWith(removeButton);
            }
        });

        function warningOutput(message, delay) {

            if (delayTimer) {
                clearTimeout(delayTimer);
            }

            $('.message.voting__message').stop(true, true).html(message).show();

            if (delay) {

                delayTimer = setTimeout(function () {
                    $('.message.voting__message').slideUp('slow');
                    delayTimer = null;
                }, delay);
            }

            $('html,body').animate({
                scrollTop: $(".message.voting__message").offset().top
            }, 1000);
        }

        function addSong(artwork, title, artist, source) {
            if (entries.length >= maxSongsSelected) {
                // alert("You cannot select more than " + maxSongsSelected + " songs");
                warningOutput("You cannot select more than " + maxSongsSelected + " songs", 3000);
                return false;
            }
            if (entries.length >= minSongsSelected - 1) {
                $('#submitVotes').attr("disabled", false);
                $('#submitVotes').addClass("button--enabled");
            }

            //replace empty slide with song detail
            var slide = getSlide(entries.length + 1, artwork, title, artist);
            var slideToUpdate = swiper.slides[entries.length];
            $(slideToUpdate).empty();
            $(slideToUpdate).append(slide);
            swiper.update();

            //update songs list added by the user
            entries.push({ SONG: title, ARTIST: artist, ARTWORK: artwork, SOURCE: source });

            //set the swiper view based on entries
            var visible = $('.swiper-slide-visible').length;
            var length = entries.length;
            if (length > visible) {
                //slide index 0-19 for 20 slides
                // if entries length is between 0-4, do not slide
                // if entries length is between 5-9, slide to 5
                // if entries length is between 10-14, slide to 10
                // if entries length is between 15-10, slide to 15
                var number = maxSongsSelected;
                var ranges = getIntervals(number - 1, visible);

                var slideIndex = 0;
                for (var i = 0; i < ranges.length; i++) {
                    var range = ranges[i];
                    if (between(length - 1, range[0], range[1])) {
                        slideIndex = range[0];
                        break;
                    }
                }
                swiper.slideTo(slideIndex); //do not slide when entries are < visible slides
            }
            return true;

        }

        //Remove Song button
        $(document).on('click', '.song .button--small.remove', function () {
            var el = $(this);
            var title = el.siblings().find($('.song__detail .song__title')).text();
            var artist = el.siblings().find($('.song__detail .song__artist')).text();

            //replace remove button with add song button
            var addButton = getAddButton();
            el.replaceWith(addButton);

            removeSong(title, artist)

        });

        function removeSong(title, artist) {
            //remove the song from entries list
            _.remove(entries, function (e) {
                return e.SONG === title && e.ARTIST === artist;
            })

            if (entries.length < minSongsSelected) {
                $('#submitVotes').attr("disabled", true);
                $('#submitVotes').removeClass("button--enabled");
            }

            //load slides added by user
            var slides = []; //songs that have been added by the user
            entries.forEach(function (entry, i) {
                slides.push(getSlide(i + 1, entry.ARTWORK, entry.SONG, entry.ARTIST))
            })
            $('.swiper-wrapper').html(slides)
            swiper.update();

            //load remaining empty slides
            loadSlides(entries.length + 1, maxSongsSelected - entries.length);
        }

        // Remove button in slides
        $(document).on('click', '#removeFromSlide', function () {
            var el = $(this).parent(); //slide__artwork is the parent
            var title = el.parent().find($('.slide__song')).text();
            var artist = el.parent().find($('.slide__artist')).text();

            removeSong(title, artist)

            //update the corresponding song button in the Browse/Search Body
            var activeRemoveButtons = $('.song .button--small.remove')
            for (var i = 0; i < activeRemoveButtons.length; i++) {
                var btn = activeRemoveButtons[i];
                var t = $(btn).siblings().find($('.song__detail .song__title')).text();
                var a = $(btn).siblings().find($('.song__detail .song__artist')).text();
                if (title === t && artist === a) {
                    //replace this buttn with add song button
                    var addButton = getAddButton();
                    $(btn).replaceWith(addButton);
                    break;
                }
            }

        });

        function getAddButton() {
            var btn = '<button class="c-button button--small button--enabled add">' +
                '<img src="https://images.mediaworks.nz/countdown/voting_widget/img/plusicon.png" class="button__icon" /> ADD SONG' +
                '</button>';
            return btn;
        }
        function getRemoveButton() {
            var btn = '<button class="c-button button--small remove">' +
                '<i class="button__icon--minus"></i> REMOVE' +
                '</button>';
            return btn;
        }
        function getSlide(number, artwork, title, artist) {
            var slide = '<div class="swiper-slide"><div class="slide swiper__slide" style="background-color: white; padding-top: 0px;"><div class="slide__artwork slide__artwork--added">' +
                '<img class="slide__image" src="' + artwork + '" />' +
                '<span id="removeFromSlide" class="button--circle minus"></span>' +
                '</div>' +
                '<div class="slide__number slide__number--added">' + number + '</div>' +
                '<div class="slide__song slide__song--added">' + title + '</div>' +
                '<div class="slide__artist slide__artist--added">' + artist + '</div></div></div>';
            return slide;
        }

        function getIntervals(max, nInt) {
            const visible = nInt - 1;
            const c = Math.ceil(max / nInt);
            const r = [];
            var j = 0;
            for (var i = 0; i <= max; i++) {
                const a = j;
                const b = j + visible;
                if (a < max) { r.push([a, b]); j += visible + 1 };
            }
            return r;
        }

        function between(x, min, max) {
            return x >= min && x <= max;
        }

        $('#searchTerm').keyup(function (e) {
            var searchTerm = $(this).val();
            searchTerm = searchTerm.trim();
            if (searchTerm == "") {
                $('.songs > .song').addClass('hidden');
                $('.songs .songs__message').hide();
            }
            if (searchTerm.length >= 2) {
                var filter = $('input[name="searchRadio"]:checked').val(); //SONG OR ARTIST
                var filteredSongs = filterAllSongs(filter, searchTerm, "contains");
                displaySongs(filter, filteredSongs);
            }
        });

        function displaySongs(filter, filteredSongs) {
            if (filteredSongs.length === 0) {
                $('.songs > .song').addClass('hidden');
                songsOutput("Sorry, your search didn't match any results. You may add the song under the 'Add Your Own' tab");
            }
            else {
                showFilteredSongs(filter, filteredSongs);
            }
        }

        $('#inputAddSongTitle').keyup(function (e) {
            var searchTerm = $(this).val();
            searchTerm = searchTerm.trim();
            if (searchTerm == "") {
                $('.songs > .song').addClass('hidden');
            }
            if (searchTerm.length >= 2) {
                var filter = "SONG";
                var filteredSongs = filterAllSongs(filter, searchTerm, "contains");
                showFilteredSongs(filter, filteredSongs);
            }
        });

        $("#btnManualEntry").unbind('click').click(function () {
            if ($("#inputAddSongTitle").val() === "" || $("#inputAddSongArtist").val() === "") {
                warningOutput("You must enter both an artist and a song", 3000);
            }
            else {
                var artwork = stationDefaultImgUrl;
                var title = $("#inputAddSongTitle").val();
                var artist = $("#inputAddSongArtist").val();
                addSong(artwork, title, artist, "MANUAL ENTRY");
                $("#inputAddSongTitle").val("");
                $("#inputAddSongArtist").val("");
            }
        });

        function songsOutput(message) {
            $('.songs .songs__message').html(message).show();
        }

        function filterAllSongs(filter, value, type) {
            var songs = []
            if (!allSongs) return songs;
            if (type === "startsWith") {
                var regex = "^";
                if (value == "#") {
                    regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\d]+/;
                    songs = allSongs.filter(function (s) {
                        return s[filter].charAt(0).match(regex);
                    });
                } else {
                    songs = allSongs.filter(function (s) {
                        return s[filter].charAt(0).match(regex + value);
                    });
                }
            } else {
                //filter type contains
                songs = allSongs.filter(function (s) {
                    return s[filter].toLowerCase().search(value.toLowerCase()) > -1;
                });
            }
            return songs;
        }

        function showFilteredSongs(filter, songs) {
            $('.songs > .song').addClass('hidden');
            $('.songs .songs__message').hide();
            //search DOM if a song is already added, (yes, unhide it), (no, add it)
            for (var i = 0; i < songs.length; i++) {
                var toAdd = true;
                var title = songs[i][filter];
                $(".song__" + (filter === "SONG" ? "title" : "artist")).each(function () {
                    if ($(this).text() === title) {
                        if ($(this).parent().parent().hasClass('hidden')) {
                            $(this).parent().parent().removeClass('hidden'); //unhide the song block
                            toAdd = false;
                            return false;
                        }
                    }
                });
                if (toAdd) {
                    addSongToDOM(songs[i]);
                }
            }

            sortSongs(filter);
            // var toAdd = songs.filter(ar => !songsExistInDOM.find(rm => (rm[filter] === ar[filter]) ))
            // //add remaining songs to DOM
            // addSongsToDOM(toAdd);
        }

        function sortSongs(filter) {
            var $songsShown = $('.songs > .song:not(.hidden)');
            $songsShown.sort(function (a, b) {
                var x = $(a).find(".song__" + (filter === "SONG" ? "title" : "artist")).text();
                var y = $(b).find(".song__" + (filter === "SONG" ? "title" : "artist")).text();
                if (x < y) return -1;
                if (x > y) return 1;
                return 0
            });
            $songsShown.detach().appendTo(".songs");
        }

        function addSongToDOM(song) {
            $('.songs').append(getSong(song));
        }

        function addSongsToDOM(songs) {
            if (songs.length === 0) return;
            var songElements = [];
            $.each(songs, function (i, song) {
                songElements.push(getSong(song));
            });
            $('.songs').append(songElements.join(''));
        }


        function getSong(song) {
            var songArtwork = song.ARTWORK ? song.ARTWORK : stationDefaultImgUrl;

            var songDiv = '<div class="song">\n' +
                '<div class="song__artwork">\n' +
                '<img src="' + songArtwork + '" />' +
                '</div>' +
                '<div class="song__detail">' +
                '<div class="song__title">' + song.SONG + '</div>' +
                '<div class="song__artist">' + song.ARTIST + '</div>' +
                '</div>' +
                '<button class="c-button button--small button--enabled add">' +
                '<img src="https://images.mediaworks.nz/countdown/voting_widget/img/plusicon.png" class="button__icon" /> ADD SONG' +
                '</button>' +
                '</div>';
            return songDiv;
        }

        function getCountdownImg(songList) {
            // some call to generate image based on songList
            generateSocialImage1200(songList, '.here')
            // return `https://via.placeholder.com/150`
        }

        function generateSocialImage1200(votes, target) {

            var canvas = document.createElement('canvas')
            var context = canvas.getContext('2d')

            // height and width of canvas
            canvas.setAttribute('width', '1200')
            canvas.setAttribute('height', '1200')

            context.fillStyle = '#ffe512'

            var background = new Image()
            background.crossOrigin = "Anonymous";
            // once the image is loaded we can then draw text over top
            background.onload = function () {

                // draw background image over the canvas
                context.drawImage(background, 0, 0)
                // draw text over top of background
                if (shareImgGeneralTextLayout === 2) {
                    generateTextInTwoColumns(context, votes);
                } else if (shareImgGeneralTextLayout === 1) {
                    generateTextInOneColumn(context, votes);
                }

                // converts the canvas to png base64
                window.dataURL = canvas.toDataURL('image/jpeg', 0.92);
                // assign dataurl to an img element
                var exportImage = new Image();
                exportImage.setAttribute('src', window.dataURL);
                exportImage.setAttribute('width', '100%');
                // append img element to the dom (target = class or id of the element you want the image in)
                document.querySelector(target).appendChild(exportImage);
                var file = dataURItoBlob(window.dataURL);

                saveToS3(file);

            }
            // assign background image
            background.src = "https://images.mediaworks.nz/countdown/image/morefm-2021-share.jpg"

        }

        const generateTextInTwoColumns = (c, votes) => {
            votes.forEach((vote, index) => {
                c.fillStyle = shareImgSongFontColor;
                c.font = shareImgTextFontStyle;
            
                var truncatedTitle = truncateText(c, vote.SONG, shareImgSongAndArtistMaxLength).toUpperCase();
                var truncatedArtist = truncateText(c, vote.ARTIST, shareImgSongAndArtistMaxLength).toUpperCase();
                var titleWidth = c.measureText(truncatedTitle).width.toFixed(0);
                var artistWidth = c.measureText(truncatedArtist).width.toFixed(0);
            
                c.textAlign = "center";
                if (index < 5) {
                  c.fillText(
                    truncatedTitle,
                    shareImgFirstVoteXCoordinate,
                    shareImgFirstVoteYCoordinate + shareImgVoteSpacing * index
                  );
            
                  c.fillStyle = shareImgArtistFontColor;
                  c.font = shareImgTextFontStyle;
                  c.fillText(
                    truncatedArtist,
                    shareImgFirstVoteXCoordinate,
                    shareImgFirstVoteYCoordinate +
                      shareImgFontSize +
                      shareImgVoteSpacing * index
                  );
                } else {
                  c.fillText(
                    truncatedTitle,
                    shareImgFirstVoteXCoordinate + 590,
                    shareImgFirstVoteYCoordinate + shareImgVoteSpacing * (index - 5)
                  );
            
                  c.fillStyle = shareImgArtistFontColor;
                  c.font = shareImgTextFontStyle;
                  c.fillText(
                    truncatedArtist,
                    shareImgFirstVoteXCoordinate + 590,
                    shareImgFirstVoteYCoordinate +
                      shareImgFontSize +
                      shareImgVoteSpacing * (index - 5)
                  );
                }
            })
        }

        const generateTextInOneColumn = (c, votes) => {
            if (shareImgSongAndArtistTextLayout === 1) {
              generateSongAndArtistTextInOneLine(c, votes);
            } else if (cshareImgSongAndArtistTextLayout === 2) {
              generateSongAndArtistTextInTwoLines(c, votes);
            }
          };

        const generateSongAndArtistTextInOneLine = (c, votes) => {
            votes.forEach((vote, index) => {
                c.textAlign = "left";
                c.fillStyle = shareImgSongFontColor;
                c.font = shareImgTextFontStyle;
            
                var truncatedTitle = truncateText(c, vote.SONG, shareImgSongAndArtistMaxLength).toUpperCase();
                var truncatedArtist = truncateText(c, vote.ARTIST, shareImgSongAndArtistMaxLength).toUpperCase();
                var titleWidth = c.measureText(truncatedTitle).width.toFixed(0);
                var artistWidth = c.measureText(truncatedArtist).width.toFixed(0);
                c.fillText(
                  truncatedTitle,
                  shareImgFirstVoteXCoordinate - 20 - titleWidth - 13,
                  shareImgFirstVoteYCoordinate + shareImgVoteSpacing * index
                );
                c.fillText(
                  "-",
                  shareImgFirstVoteXCoordinate - 13,
                  shareImgFirstVoteYCoordinate + shareImgVoteSpacing * index
                );
            
                c.fillStyle = shareImgArtistFontColor;
                c.font = shareImgTextFontStyle;
                c.fillText(
                  truncatedArtist,
                  shareImgFirstVoteXCoordinate + 20,
                  shareImgFirstVoteYCoordinate + shareImgVoteSpacing * index
                );
              });
        }

        const generateSongAndArtistTextInTwoLines = (c, votes) => {
            votes.forEach((vote, index) => {
                c.fillStyle = shareImgSongFontColor;
                c.font = shareImgTextFontStyle;
            
                var truncatedTitle = truncateText(c, vote.SONG, shareImgSongAndArtistMaxLength).toUpperCase();
                var truncatedArtist = truncateText(c, vote.ARTIST, shareImgSongAndArtistMaxLength).toUpperCase();
                var titleWidth = c.measureText(truncatedTitle).width.toFixed(0);
                var artistWidth = c.measureText(truncatedArtist).width.toFixed(0);
                c.textAlign = "center";
            
                c.fillText(
                  truncatedTitle,
                  shareImgFirstVoteXCoordinate,
                  shareImgFirstVoteYCoordinate + shareImgVoteSpacing * index
                );
            
                c.fillStyle = shareImgArtistFontColor;
                c.font = shareImgTextFontStyle;
                c.fillText(
                  truncatedArtist,
                  shareImgFirstVoteXCoordinate,
                  shareImgFirstVoteYCoordinate +
                    shareImgFontSize +
                    shareImgVoteSpacing * index
                );
              });
        }

        function generateSocialImage1920(votes, target) {

            var canvas = document.createElement('canvas')
            var context = canvas.getContext('2d')

            // height and width of canvas
            canvas.setAttribute('width', '1080')
            canvas.setAttribute('height', '1920')

            context.fillStyle = '#da291c'

            var background = new Image()
            background.crossOrigin = "Anonymous";
            // once the image is loaded we can then draw text over top
            background.onload = function () {

                // draw background image over the canvas
                context.drawImage(background, 0, 0)
                // draw text over top of background
                votes.forEach((vote, index) => {
                    context.fillStyle = 'white'
                    context.font = '28px TradeGothicCondensedBold'

                    var truncatedTitle = truncateText(context, vote.SONG, 400).toUpperCase();
                    var truncatedArtist = truncateText(context, vote.ARTIST, 400).toUpperCase();
                    var titleWidth = context.measureText(truncatedTitle).width.toFixed(0);
                    var artistWidth = context.measureText(truncatedArtist).width.toFixed(0);
                    context.fillText(
                        truncatedTitle,
                        (520 - titleWidth) - 13,
                        616 + (58.5 * index)
                    )
                    context.fillStyle = 'white';
                    context.font = '28px TradeGothicCondensedBold'
                    context.fillText(
                        '-',
                        (1080 / 2) - 13,
                        616 + (58.5 * index)
                    )
                    context.fillStyle = '#da291c';
                    context.font = '28px TradeGothicCondensedBold'
                    context.fillText(
                        truncatedArtist,
                        555 + 7,
                        616 + (58.5 * index)
                    )
                })

                // converts the canvas to png base64
                window.dataURL = canvas.toDataURL('image/jpeg', 0.92);
                // assign dataurl to an img element
                var exportImage = new Image();
                exportImage.setAttribute('src', window.dataURL);
                exportImage.setAttribute('width', '100%');
                // append img element to the dom (target = class or id of the element you want the image in)
                document.querySelector(target).appendChild(exportImage);
                var file = dataURItoBlob(window.dataURL);

                saveToS3(file);

            }
            // assign background image
            background.src = "https://images.mediaworks.nz/countdown/image/rock-2021-share.jpg"

        }

        function truncateText(c, str, maxWidth) {
            var width = c.measureText(str).width;
            var ellipsis = '…';
            var ellipsisWidth = c.measureText(ellipsis).width;
            if (width <= maxWidth || width <= ellipsisWidth) {
                return str;
            } else {
                var len = str.length;
                while (width >= maxWidth - ellipsisWidth && len-- > 0) {
                    str = str.substring(0, len);
                    width = c.measureText(str).width;
                }
                return str + ellipsis;
            }
        }

        function dataURItoBlob(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);
            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ia], { type: mimeString });
        }

        function saveToS3(file) {

            //var buf = new Buffer(window.dataURL.replace(/^data:image\/\w+;base64,/, ""),'base64')

            var thisFileName = 'theedge-countdown-votes.jpg';
            thisFileName = thisFileName.toLowerCase();
            var thisTimeStamp = moment().format('YYYY-MM-DD-h-m-s');
            //Ajax call to server for S3 signed URL (for PUT)
            var ajaxS3Request = $.ajax({ url: 'https://radio-api.mediaworks.nz' + "/comp-api/v1/s3/" + thisFileName + "?filename=countdown" + "/theedge-2022/" + thisTimeStamp + "-" + thisFileName });

            //Fail
            ajaxS3Request.fail(function (e) {
                alert("Error: " + JSON.stringify(e));
            })

            //Success
            ajaxS3Request.done(function (s3data) {
                console.log(s3data);
                PUTtoS3(s3data, file);
            });

            function PUTtoS3(s3data, file) {
                // Make Ajax request with the contentType = false, and processData = false
                var ajaxRequest = $.ajax({
                    type: 'PUT',
                    url: s3data.url,
                    data: file,
                    processData: false, contentType: false,

                    xhr: function () {  // Custom XMLHttpRequest
                        var myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload) { // Check if upload property exists
                            myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // For handling the progress of the upload
                        }
                        return myXhr;
                    }
                });

                function progressHandlingFunction(e) {
                    console.log("uploading image");
                }

                ajaxRequest.done(function (responseData, textStatus) {
                    var cdnfile = "https://images.mediaworks.nz/" + s3data.filename;
                    console.log(cdnfile);
                    console.log(s3data);
                    // $('#fbShare').show();
                    // $('#fbShare').css({"display" :"block"});
                    document.getElementById('fbShare').setAttribute('data-href', cdnfile);
                    var srcShare = $("iframe[title='fb:share_button Facebook Social Plugin']")[0].src;
                    var res = srcShare.substring(0, srcShare.indexOf("href=")) + "href=" + cdnfile + "&layout=button&locale=en_US&sdk=joey&size=large";
                    $("iframe[title='fb:share_button Facebook Social Plugin']")[0].src = res;
                    $('#fbShare').show();
                    var twitterShare = '<a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-size="large" data-text="I\'ve just voted in This is test vote name! Check out my votes below... " data-url="' + cdnfile + '" data-hashtags="theedgecountdown2022" data-lang="en" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';
                    $('#twitterShare').append(twitterShare);
                });
            }
        }
    }
    // })
})(jQuery);
    