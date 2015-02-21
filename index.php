<?php include('header.php'); ?>
			<div class="row subtitle-row">
				<div class="col-md-4 col-md-offset-4">
					<div class="input-group">
						<input type="text" class="form-control" id="street-input" placeholder="Street name">
						<span class="input-group-btn">
							<button id="search-btn" class="btn btn-default" type="button" onclick="streetSearch()">Search</button>
						</span>
					</div><!-- /input-group -->
				</div><!-- /.col-md-4 -->
			</div>
			<div class="row map-link-row">
				<div class="col-md-4 col-md-offset-4">
					<p class="text-center"><a href="#" id="maps-link">Search street name using Goggle Maps</a></p>
				</div>
			</div>

			<div class="row maps-row hidden">
				<div class="col-md-6 col-md-offset-3">
					<div id="map-canvas" data-toggle="hover" data-trigger="manual" title="Using maps" data-content="Click on the desired street to load it up on the search box" data-placement="bottom"></div>
				</div>
			</div>

			<div class="row">
				<div id="search-result-wrapper" class="col-md-6 col-md-offset-3">
					<!-- MUSTACHE TEMPLATE -->
					<script id="streetSearchTMPL" type="x-tmpl-mustache">
						<div id="search-result-panel" class="panel panel-default">
							<div class="panel-heading">Routes</div>
								<ul class="list-group">
									{{#results}}
										<li class="list-group-item"><a href="/details/{{id}}" class="ridelink">{{name}}</a></li>
									{{/results}}
								</ul>
							</div>
						</div>
					</script>
					<!-- END MUSTACHE TEMPLATE -->
				</div>
			</<div>
		</div>
<?php include('footer.php') ?>
