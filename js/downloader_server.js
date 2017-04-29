/* global jQuery, JSZip, JSZipUtils, saveAs */

jQuery(function($) {
	'use strict';

	var Promise = window.Promise || JSZip.external.Promise;

	/**
	 * Reset the message.
	 */
	var resetMessage = function() {
		$('#result')
			.removeClass()
			.text('');
	};
	/**
	 * show a successful message.
	 * @param {String} text the text to show.
	 */
	var showMessage = function(text) {
		resetMessage();
		$('#result')
			.addClass('alert alert-success')
			.text(text);
	};
	/**
	 * show an error message.
	 * @param {String} text the text to show.
	 */
	var showError = function(text) {
		resetMessage();
		$('#result')
			.addClass('alert alert-danger')
			.text(text);
	};
	/**
	 * Update the progress bar.
	 * @param {Integer} percent the current percent
	 */
	var updatePercent = function(percent) {
		$('#progress_bar').removeClass('hide')
			.find('.progress-bar')
			.attr('aria-valuenow', percent)
			.css({
				width: percent + '%'
			});
	};

	/**
	 * Fetch the content and return the associated promise.
	 * @param {String} url the url of the content to fetch.
	 * @return {Promise} the promise containing the data.
	 */
	var urlToPromise = function(url) {
		return new Promise(function(resolve, reject) {
			JSZipUtils.getBinaryContent(url, function(err, data) {
				if (err) {
					reject(err);
				}
				else {
					resolve(data);
				}
			});
		});
	};

	var surround = function(a, x, b) {
		if (x !== '') return (a || '')+x+(b || '');
		return x;
	};

	if (!JSZip.support.blob) {
		showError('This only works with a good browser!');
		return;
	}

	$('#download_form').on('submit', function() {
		resetMessage();

		var zip = new JSZip();
		//var customs = ''; //a var to store all the extra stuff to add to autoexec

		//getting values form inputs
		// !!!!IMPORTANT!!!! All the selectable html fields (non-text forms) should have data-name and data-url attributes or everything breaks

		//general
		//var os = $('#os').val();
		var hostname    = $('#hostname').val();
		var sv_password = $('#sv_password').val();
		var sv_lan      = $('#sv_lan').val();
		///---

		//security
		var rcon_password      = $('#rcon_password').val();
		var sv_rcon_banpenalty = $('#sv_rcon_banpenalty').val();

		var sv_rcon_minfailures = $('#sv_rcon_minfailures').val();
		var sv_rcon_maxfailures = $('#sv_rcon_maxfailures').val();

		var log        = $('#log').val();
		var sv_logfile = $('#sv_logfile').val();
		var sv_logecho = $('#sv_logecho').val();
		var sv_logbans = $('#sv_logbans').val();
		///---

		var tftrue_maxfov    = $('#tftrue_maxfov').val();
		var tftrue_freezecam = $('#tftrue_freezecam').val();

		var tftrue_tv_autorecord = $('#tftrue_tv_autorecord').val();
		var tftrue_tv_demos_path = $('#tftrue_tv_demos_path').val();

		var tftrue_whitelist_id = $('#tftrue_whitelist_id').val();
		var tftrue_no_hats      = $('#tftrue_no_hats').val();
		var tftrue_no_misc      = $('#tftrue_no_misc').val();

		var tftrue_logs_apikey  = $('#tftrue_logs_apikey').val();
		var tftrue_restorestats = $('#tftrue_restorestats').val();
		var tftrue_bunnyhop     = $('#tftrue_bunnyhop').val();
		///---

		//various
		var sv_allow_wait_command = $('#sv_allow_wait_command').val();
		var sv_cheats             = $('#sv_cheats').val();
		var sv_pausable           = $('#sv_pausable').val();
		var sv_alltalk            = $('#sv_alltalk').val();

		var sv_pure              = $('#sv_pure').val();
		var sv_pure_kick_clients = $('#sv_pure_kick_clients').val();

		var tf_weapon_criticals        = $('#tf_weapon_criticals').val();
		var tf_use_fixed_weaponspreads = $('#tf_use_fixed_weaponspreads').val();

		var mp_allowspectators = $('#mp_allowspectators').val();
		var mp_forcecamera     = $('#mp_forcecamera').val();

		var mp_autoteambalance       = $('#mp_autoteambalance').val();
		var mp_teams_unbalance_limit = $('#mp_teams_unbalance_limit').val();

		var mp_winlimit  = $('#mp_winlimit').val();
		var mp_timelimit = $('#mp_timelimit').val();

		var mp_stalemate_enable    = $('#mp_stalemate_enable').val();
		var mp_stalemate_timelimit = $('#mp_stalemate_timelimit').val();
		///---

		//net
		var sv_maxrate = $('#sv_maxrate').val();
		var sv_minrate = $('#sv_minrate').val();

		var sv_maxupdaterate = $('#sv_maxupdaterate').val();
		var sv_minupdaterate = $('#sv_minupdaterate').val();

		var sv_maxcmdrate = $('#sv_maxcmdrate').val();
		var sv_mincmdrate = $('#tf_use_fixed_weaponspreads').val();
		///---

		//get large piece of custom set
		var bindings = $('#bindings').val();
		var tftrueset = '';

		if ($('#tftrue').is(':checked')) {
			tftrueset = [
				'//tftrue settings',
				'//Made with cfg.tf - custom Team Fortress 2 config generator',
				'',
				'tftrue_maxfov '   +tftrue_maxfov,
				'tftrue_freezecam '+tftrue_freezecam,
				'tftrue_bunnyhop ' +tftrue_bunnyhop,
				'',
				'tftrue_logs_apikey ' +tftrue_logs_apikey,
				'tftrue_restorestats '+tftrue_restorestats,
				'',
				'tftrue_tv_autorecord '+tftrue_tv_autorecord,
				'tftrue_tv_demos_path '+tftrue_tv_demos_path,
				'',
				'tftrue_whitelist_id '+tftrue_whitelist_id,
				'tftrue_no_hats '     +tftrue_no_hats,
				'tftrue_no_misc '     +tftrue_no_misc,
				''
			].join('\n');
		}

		// find every checked item
		$(this).find(':checked').each(function() {

			var $this = $(this);
			//var url = $this.data('url');
			var iswhat = $this.data('name');
			//var filename = url.replace(/.*\//g, '');
			if (iswhat === 'tftrue') {
				zip.file('addons/TFTrue.dll', urlToPromise('../server/addons/tftrue/TFTrue.dll'), {
					binary: true
				});
				zip.file('addons/TFTrue.so', urlToPromise('../server/addons/tftrue/TFTrue.so'), {
					binary: true
				});
				zip.file('addons/TFTrue.vdf', urlToPromise('../server/addons/tftrue/TFTrue.dll'), {
					binary: true
				});
				zip.file('addons/tftrue_readme.txt', urlToPromise('../server/addons/tftrue/tftrue_readme.txt'), {
					binary: true
				});
			}
			else if (iswhat === 'etf2l') {
				zip.file('cfg/etf2l.cfg', urlToPromise('../server/cfg/etf2l/etf2l.cfg'), {
					binary: true
				});
				zip.file('cfg/etf2l_6v6.cfg', urlToPromise('../server/cfg/etf2l/etf2l_6v6.cfg'), {
					binary: true
				});
				zip.file('cfg/etf2l_6v6_5cp.cfg', urlToPromise('../server/cfg/etf2l/etf2l_6v6_5cp.cfg'), {
					binary: true
				});
				zip.file('cfg/etf2l_6v6_ctf.cfg', urlToPromise('../server/cfg/etf2l/etf2l_6v6_ctf.cfg'), {
					binary: true
				});
				zip.file('cfg/etf2l_6v6_koth.cfg', urlToPromise('../server/cfg/etf2l/etf2l_6v6_koth.cfg'), {
					binary: true
				});
				zip.file('cfg/etf2l_6v6_stopwatch.cfg', urlToPromise('../server/cfg/etf2l/etf2l_6v6_stopwatch.cfg'), {
					binary: true
				});
				zip.file('cfg/etf2l_9v9.cfg', urlToPromise('../server/cfg/etf2l/etf2l_9v9.cfg'), {
					binary: true
				});
				zip.file('cfg/etf2l_9v9_5cp.cfg', urlToPromise('../server/cfg/etf2l/etf2l_9v9_5cp.cfg'), {
					binary: true
				});
				zip.file('cfg/etf2l_9v9_ctf.cfg', urlToPromise('../server/cfg/etf2l/etf2l_9v9_ctf.cfg'), {
					binary: true
				});
				zip.file('cfg/etf2l_9v9_koth.cfg', urlToPromise('../server/cfg/etf2l/etf2l_9v9_koth.cfg'), {
					binary: true
				});
				zip.file('cfg/etf2l_9v9_stopwatch.cfg', urlToPromise('../server/cfg/etf2l/etf2l_9v9_stopwatch.cfg'), {
					binary: true
				});
				zip.file('cfg/etf2l_bball.cfg', urlToPromise('../server/cfg/etf2l/etf2l_bball.cfg'), {
					binary: true
				});
				zip.file('cfg/etf2l_custom.cfg', urlToPromise('../server/cfg/etf2l/etf2l_custom.cfg'), {
					binary: true
				});
				zip.file('cfg/etf2l_golden_cap.cfg', urlToPromise('../server/cfg/etf2l/etf2l_golden_cap.cfg'), {
					binary: true
				});
				zip.file('cfg/etf2l_whitelist_6v6.txt', urlToPromise('../server/cfg/etf2l/etf2l_whitelist_6v6.txt'), {
					binary: true
				});
				zip.file('cfg/etf2l_whitelist_9v9.txt', urlToPromise('../server/cfg/etf2l/etf2l_whitelist_9v9.txt'), {
					binary: true
				});
				zip.file('cfg/etf2l_whitelist_bball.txt', urlToPromise('../server/cfg/etf2l/etf2l_whitelist_bball.txt'), {
					binary: true
				});
				zip.file('cfg/etf2l_whitelist_ultiduo.txt', urlToPromise('../server/cfg/etf2l/etf2l_whitelist_ultiduo.txt'), {
					binary: true
				});
			}
			else if (iswhat === 'ugc') {
				zip.file('cfg/ugc_4v_base.cfg', urlToPromise('../server/cfg/ugc/ugc_4v_base.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_4v_custom.cfg', urlToPromise('../server/cfg/ugc/ugc_4v_custom.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_4v_golden.cfg', urlToPromise('../server/cfg/ugc/ugc_4v_golden.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_4v_koth.cfg', urlToPromise('../server/cfg/ugc/ugc_4v_koth.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_4v_koth_overtime.cfg', urlToPromise('../server/cfg/ugc/ugc_4v_koth_overtime.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_4v_standard.cfg', urlToPromise('../server/cfg/ugc/ugc_4v_standard.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_4v_standard_overtime.cfg', urlToPromise('../server/cfg/ugc/ugc_4v_standard_overtime.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_4v_stopwatch.cfg', urlToPromise('../server/cfg/ugc/ugc_4v_stopwatch.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_6v_base.cfg', urlToPromise('../server/cfg/ugc/ugc_6v_base.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_6v_custom.cfg', urlToPromise('../server/cfg/ugc/ugc_6v_custom.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_6v_golden.cfg', urlToPromise('../server/cfg/ugc/ugc_6v_golden.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_6v_koth.cfg', urlToPromise('../server/cfg/ugc/ugc_6v_koth.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_6v_koth_overtime.cfg', urlToPromise('../server/cfg/ugc/ugc_6v_koth_overtime.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_6v_standard.cfg', urlToPromise('../server/cfg/ugc/ugc_6v_standard.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_6v_standard_overtime.cfg', urlToPromise('../server/cfg/ugc/ugc_6v_standard_overtime.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_6v_stopwatch.cfg', urlToPromise('../server/cfg/ugc/ugc_6v_stopwatch.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_HL_base.cfg', urlToPromise('../server/cfg/ugc/ugc_HL_base.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_HL_ctf.cfg', urlToPromise('../server/cfg/ugc/ugc_HL_ctf.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_HL_custom.cfg', urlToPromise('../server/cfg/ugc/ugc_HL_custom.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_HL_koth.cfg', urlToPromise('../server/cfg/ugc/ugc_HL_koth.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_HL_standard.cfg', urlToPromise('../server/cfg/ugc/ugc_HL_standard.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_HL_stopwatch.cfg', urlToPromise('../server/cfg/ugc/ugc_HL_stopwatch.cfg'), {
					binary: true
				});
				zip.file('cfg/ugc_off.cfg', urlToPromise('../server/cfg/ugc/ugc_off.cfg'), {
					binary: true
				});
				zip.file('cfg/item_whitelist_ugc_4v4.txt', urlToPromise('../server/cfg/ugc/item_whitelist_ugc_4v4.txt'), {
					binary: true
				});
				zip.file('cfg/item_whitelist_ugc_hl.txt', urlToPromise('../server/cfg/ugc/item_whitelist_ugc_hl.txt'), {
					binary: true
				});
			}
			else if (iswhat === 'ozfortress') {
				zip.file('cfg/ozfortress.cfg', urlToPromise('../server/cfg/oz/ozfortress.cfg'), {
					binary: true
				});
				zip.file('cfg/ozfortress_6v6.cfg', urlToPromise('../server/cfg/oz/ozfortress_6v6.cfg'), {
					binary: true
				});
				zip.file('cfg/ozfortress_6v6_5cp.cfg', urlToPromise('../server/cfg/oz/ozfortress_6v6_5cp.cfg'), {
					binary: true
				});
				zip.file('cfg/ozfortress_6v6_koth.cfg', urlToPromise('../server/cfg/oz/ozfortress_6v6_koth.cfg'), {
					binary: true
				});
				zip.file('cfg/ozfortress_6v6_push.cfg', urlToPromise('../server/cfg/oz/ozfortress_6v6_push.cfg'), {
					binary: true
				});
				zip.file('cfg/ozfortress_6v6_scrim.cfg', urlToPromise('../server/cfg/oz/ozfortress_6v6_scrim.cfg'), {
					binary: true
				});
				zip.file('cfg/ozfortress_9v9.cfg', urlToPromise('../server/cfg/oz/ozfortress_9v9.cfg'), {
					binary: true
				});
				zip.file('cfg/ozfortress_9v9_5cp.cfg', urlToPromise('../server/cfg/oz/ozfortress_9v9_5cp.cfg'), {
					binary: true
				});
				zip.file('cfg/ozfortress_9v9_koth.cfg', urlToPromise('../server/cfg/oz/ozfortress_9v9_koth.cfg'), {
					binary: true
				});
				zip.file('cfg/ozfortress_9v9_push.cfg', urlToPromise('../server/cfg/oz/ozfortress_9v9_push.cfg'), {
					binary: true
				});
				zip.file('cfg/ozfortress_9v9_scrim.cfg', urlToPromise('../server/cfg/oz/ozfortress_9v9_scrim.cfg'), {
					binary: true
				});
				zip.file('cfg/ozfortress_9v9_stopwatch.cfg', urlToPromise('../server/cfg/oz/ozfortress_9v9_stopwatch.cfg'), {
					binary: true
				});
				zip.file('cfg/ozfortress_golden_cap.cfg', urlToPromise('../server/cfg/oz/ozfortress_golden_cap.cfg'), {
					binary: true
				});
				zip.file('cfg/ozfortress_ultiduo.cfg', urlToPromise('../server/cfg/oz/ozfortress_ultiduo.cfg'), {
					binary: true
				});
				zip.file('cfg/ozfortress_whitelist_6v6.txt', urlToPromise('../server/cfg/oz/ozfortress_whitelist_6v6.txt'), {
					binary: true
				});
				zip.file('cfg/ozfortress_whitelist_9v9.txt', urlToPromise('../server/cfg/oz/ozfortress_whitelist_9v9.txt'), {
					binary: true
				});
				zip.file('cfg/ozfortress_whitelist_ultiduo.txt', urlToPromise('../server/cfg/oz/ozfortress_whitelist_ultiduo.txt'), {
					binary: true
				});
			}
		});

		//building and downloading static configs
		var server = [
			'//server settings',
			'//Made with cfg.tf - custom Team Fortress 2 config generator',
			'',
			'hostname "'   +hostname   +'"',
			'sv_password "'+sv_password+'"',
			'',
			'sv_cheats '+sv_cheats,
			'sv_pausable '+sv_pausable,
			'sv_alltalk ' + sv_alltalk,
			'sv_allow_wait_command '+sv_allow_wait_command,
			'sv_lan '+sv_lan,
			'',
			'sv_pure '             +sv_pure,
			'sv_pure_kick_clients '+sv_pure_kick_clients,
			'///---',
			'',
			'sv_maxrate '+sv_maxrate,
			'sv_minrate '+sv_minrate,
			'',
			'sv_maxupdaterate '+sv_maxupdaterate,
			'sv_minupdaterate '+sv_minupdaterate,
			'',
			'sv_maxcmdrate '+sv_maxcmdrate,
			'sv_mincmdrate '+sv_mincmdrate,
			'///---',
			'',
			'tf_weapon_criticals '       +tf_weapon_criticals,
			'tf_use_fixed_weaponspreads '+tf_use_fixed_weaponspreads,
			'',
			'mp_autoteambalance '      +mp_autoteambalance,
			'mp_teams_unbalance_limit '+mp_teams_unbalance_limit,
			'',
			'mp_winlimit ' +mp_winlimit,
			'mp_timelimit '+mp_timelimit,
			'',
			'mp_allowspectators '+mp_allowspectators,
			'mp_forcecamera '    +mp_forcecamera,
			'',
			'mp_stalemate_enable '   +mp_stalemate_enable,
			'mp_stalemate_timelimit '+mp_stalemate_timelimit,
			'///---',
			'',
			'rcon_password "'    +rcon_password+'"',
			'sv_rcon_banpenalty '+sv_rcon_banpenalty,
			'',
			'sv_rcon_minfailures '+sv_rcon_minfailures,
			'sv_rcon_maxfailures '+sv_rcon_maxfailures,
			'///---',
			'',
			'log '       +log,
			'sv_logfile '+sv_logfile,
			'sv_logecho '+sv_logecho,
			'sv_logbans '+sv_logbans,
			'///---',
			surround('\n', tftrueset, '///---\n')+
			surround('\n', bindings, '///---\n'),
			'//shameless promotion',
			'echo "-----------------------------------------------------------"',
			'echo "------------------Thanks for using CFG.TF------------------"',
			'echo "------Create your own custom config at https://cfg.tf------"',
			'echo "-----------------------------------------------------------"'
		].join('\n');
		zip.file('cfg/server.cfg', server); //server

		// when everything has been downloaded, we can trigger the dl
		zip.generateAsync({type: 'blob'},
			function updateCallback(metadata) {
				var msg = 'Packing : ' + metadata.percent.toFixed(2) + ' %';
				if (metadata.currentFile) {
					msg += ', current file = ' + metadata.currentFile;
				}
				showMessage(msg);
				updatePercent(metadata.percent | 0);
			})
			.then(function callback(blob) {
				// see FileSaver.js
				saveAs(blob, 'server_config.zip');

				showMessage('Done! Extract this archive to your server /tf folder.');
			}, function(e) {
				showError(e);
			});

		return false;
	});
});
