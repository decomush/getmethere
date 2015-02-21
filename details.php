<?php include('header.php'); ?>
	<div class="row subtitle-row">
		<div class="col-md-10 col-md-offset-1">
			<div class="row">
				<div class="col-md-1 col-xs-2">
					<button type="button" class="btn btn-default" aria-label="Left Align" onclick="history.go(-1);">
						<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
					</button>
				</div>
			    <div class="col-md-10 col-xs-10 subtitle-column">
					<h3 id="ride-title" class="text-center"></h3>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div id="stops-result-wrapper" class="col-md-6 col-md-offset-1">
			<!-- MUSTACHE TEMPLATE -->
			<script id="stopsTMPL" type="x-tmpl-mustache">
				<div id="stops-result-panel" class="panel panel-default">
					<div class="panel-heading">Route</div>
						<ul class="list-group">
							{{#results}}
								<li class="list-group-item">{{.}}</li>
							{{/results}}
						</ul>
					</div>
				</div>
			</script>
			<!-- END MUSTACHE TEMPLATE -->
		</div>
		<div id="departures-result-wrapper" class="col-md-4">
			<!-- MUSTACHE TEMPLATE -->
			<script id="departuresTMPL" type="x-tmpl-mustache">
				<div id="departures-result-panel" class="panel panel-default">
					<div class="panel-heading">Weekdays Departures</div>
						<ul class="list-group">
							<li class="list-group-item">{{depsWeekdays}}</li>
						</ul>
					</div>
				</div>
				<div id="departures-result-panel" class="panel panel-default">
					<div class="panel-heading">Saturday Departures</div>
						<ul class="list-group">
							<li class="list-group-item">{{depsSat}}</li>
						</ul>
					</div>
				</div>
				<div id="departures-result-panel" class="panel panel-default">
					<div class="panel-heading">Sunday Departures</div>
						<ul class="list-group">
							<li class="list-group-item">{{depsSun}}</li>
						</ul>
					</div>
				</div>
			</script>
			<!-- END MUSTACHE TEMPLATE -->
		</div>
	</div>
<?php include('footer.php') ?>
