
var player = null;
var url = "http://msleurope1.akamaized.net/hls/live/2000130/maatv1msl/playlist.m3u8";
var player_sources = [];
var played = false;
var availableForAd = false;
var ads = ["vpn728","moviesjoin","moviesdark","UseNeXT","Aiminer"];
var poster = "";


$(document).ready(function(e){
	
	setPlayerContainer();
	
	if(poster == "")
	{
		loadPlayer();
	}
});

$(window).resize(function(e){
	
	setPlayerContainer();
});

function playerOnClick()
{
	if(availableForAd)
	{
		availableForAd = false;
		loadAd();
		if(played)
		{
			player.pause();
		}
		else
		{
			loadPlayer();
		}
	}
	else
	{
		if(!played)
		{
		    if(player !=null)
    	    {
    	        player.play();
    	    }
    	    else
    	    {
    	        loadPlayer();
    	        player.play();
    	    }
			
			played = true;
		}
	}
}

function adTimer()
{
	var second = 1000;
	var minute = 60*second;
	window.setTimeout(function(){
		
		availableForAd = false;
	},5*minute);
}

function loadAd()
{

	if(ads.length<0)
	{
		var ad = ads[Math.floor(Math.random()*ads.length)];
		window.open("http://www.hlstester.com/embed/out.php?url="+ad);
		adTimer();
	}
}

function setPlayerContainer()
{
	if(player != null)
	{
		player.width(100);
		player.height(100);
	}
	
	var pwidth = window.innerWidth;
	var pheight = window.innerHeight;
	
	$( "#player" ).width( pwidth );
	$( "#player" ).height( pheight );
	
	if(player != null)
	{
		player.width($(".player-inner").width());
		player.height($(".player-inner").height());
	}
}

function loadPlayer()
{
	var player_type = $( "#player_type" ).val();
	if ( $( player_sources ).length > 0 || validateUrl( url ) )
	{
		if ( player != null ) {
			var oldPlayer = document.getElementById( 'hls-player' );
			videojs( oldPlayer ).dispose();
		}

		var pwidth = $( "#player" ).width();
		var pheight = $( "#player" ).height();

		$( "#player .player-inner" ).html( "" );

		var type = "";
		if ( isRTMP( url ) ) {
			type = ' type="rtmp/mp4"';
		}

		var uiText = "";
		uiText += '<video id="hls-player" class="video-js vjs-default-skin vjs-big-play-centered">';
		
		if ( $( player_sources ).length > 0 )
		{
			var urlFound = false;
			$( player_sources ).each( function ( index, elem ) {

				var label = "Video " + ( index + 1 );
				if ( elem.url && elem.url.length > 0 && elem.type && elem.type.length > 0 ) {
					urlFound = true;

					if ( elem.label && elem.label != "" ) {
						label = elem.label;
					}

					var selected = "";
					if ( index == 0 ) {
						selected = ' selected=true';
					}
                    
                    elem.url = decodeURI(elem.url);
					uiText += '<source src="' + elem.url + '" type="' + elem.type + '" label="' + label + '" ' + selected + '>';
				}
			} );

			if ( !urlFound ) {
			    url = decodeURI(url);
				uiText += '<source src="' + url + '" ' + type + '>';
			}
		} else {
		    url = decodeURI(url);
			uiText += '<source src="' + url + '" ' + type + '>';
		}
		uiText += '</video>';

		$( "#player .player-inner" ).html( uiText );

		player = videojs( 'hls-player', {
			width: pwidth,
			height: pheight,
			controls: true,
			autoplay: false,
			flash: {
				swf: 'https://www.hlstester.com/VideoJS.swf'
			},
			techOrder: [ "flash", "html5" ],
			controlBar: {
				children: ['playToggle',
					   	'volumePanel',
						//'timeDivider',
						'currentTimeDisplay',
						'liveDisplay',
						'progressControl',
						'durationDisplay',
						//'remainingTimeDisplay',
						'customControlSpacer',
						'playbackRateMenuButton',
						'chaptersButton',
						'subsCapsButton',
						'audioTrackButton',
						'qualitySelector',
						'fullscreenToggle'
					 ],
			}
		} );
		
		videojs('hls-player').ready(function() {
			this.hotkeys({
				volumeStep: 0.1,
				seekStep: 10,
				enableModifiersForNumbers: false
			});
		});
	}
}

function isRTMP(url)
{
	url_arr=url.split(":");
	if(url_arr[0].toLowerCase()=="rtmp"){
		return true
	}
	return false;
}

function validateUrl(url)
{
	if(url == "")
	{
		return false;
	}
	else
	{
		return true;
	}
}