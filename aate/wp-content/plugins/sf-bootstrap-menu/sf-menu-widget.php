<?php 

class SfMenuWidget extends WP_Widget
{
	protected $defaults;
 
  function __construct(){
	$tdom = 'sf-bootstrap-menu';
	$this->defaults = array(
			'title'         	=> '',
			'alignment' 		=> '1',
			'show_root'			=> true,
			'child_of'        	=> '',
			'exclude'    		=> '',
			'sort_column'   	=> 'post_title',
			'sort_order' 		=> 'ASC',
			'post_status' 		=> '',
			'title_color' 		=> '#505050',
			'items_color' 		=> '#f1f1f1',
		);

    $widget_ops = array('classname' => 'sfmenuwidget',
			'description' => __( "SF Bootstrap Menu Widget", $tdom) );
    $control_ops = array('width' => 300, 'height' => 300);
    parent::__construct( 'sfmenu', __('SF Bootstrap Menu', $tdom), $widget_ops, $control_ops);
	
  }
  
function list_vertical($args = '') {
     
    $my_includes = Array();
      
      if (isset($args['child_of']) && $args['child_of']) {
        $childs = $args['child_of'];
		$child_arr = explode(",", $childs);
		
		foreach($child_arr as $child) {
			$my_includes[] = $child;
		}
      } else {
		// Query pages.  NOTE: The array is sorted in alphabetical, or menu, order.
		$pages = get_pages($args);
		
 		foreach ( $pages as $page ) {
		  $my_includes[] = $page->ID;
		  }
	  }
	
	$pageids = array();
	if (!empty($my_includes)) {	  
		foreach($my_includes as $parent) {
		
			if (isset($args['show_root']) && $args['show_root'] == 'yes') {
				array_push($pageids, $parent);
			}
			
			$args_child=array(
				'child_of' => $parent
			);
			$pages = get_pages($args_child);
			
			foreach ($pages as $page) {
				array_push($pageids, $page->ID);
			}
		}
	}
	
	$output = "";
	?>
	  <style type="text/css">
		.nav-side-menu {font-size: 12px;font-weight: 200;background-color: <?php echo $args['items_color']; ?>;		}
		.nav-side-menu .brand {background-color: <?php echo $args['title_color']; ?>;line-height: 50px;display: block;text-align: center;font-size: 14px; color:#fff;}
	  </style>
	  <?php
	  

	if (!empty($pageids)) {	  		
		// List pages, if any. Blank title_li suppresses unwanted elements.
		$output .= wp_list_pages( Array('title_li' => '',
					'sort_column' => $args['sort_column'],
					'sort_order' => $args['sort_order'],
					'include' => $pageids,
					'exclude' => $args['exclude'],
					'walker'  => new sf_bootstrap_walker_page()
				) );									
		
	} else {
		$output .= wp_list_pages( Array('title_li' => '',
					'sort_column' => $args['sort_column'],
					'sort_order' => $args['sort_order'],
					'exclude' => $args['exclude'],
					'walker'  => new sf_bootstrap_walker_page()
				) );
	}
	
	return $output;
}

function list_horizontal($args = '') {
      
    // Add pages that were selected
    $my_includes = Array();

	if (isset($args['child_of']) && $args['child_of']) {
		$childs = $args['child_of'];
		$child_arr = explode(",", $childs);
		
		foreach($child_arr as $child) {
			$my_includes[] = $child;
		}
	} else {
			// Query pages.  NOTE: The array is sorted in alphabetical, or menu, order.
			$pages = get_pages($args);
			foreach ( $pages as $page ) {
				$my_includes[] = $page->ID;
			}
	}
	
	$pageids = array();
	if (!empty($my_includes)) {	  
		foreach($my_includes as $parent) {
		
			if (isset($args['show_root']) && $args['show_root'] == 'yes') {
				array_push($pageids, $parent);
			}
			
			$args_child=array(
				'child_of' => $parent
			);
			$pages = get_pages($args_child);
			
			foreach ($pages as $page) {
				array_push($pageids, $page->ID);
			}
		}
	}
	
	$output = "";
	?>
	  <style type="text/css">
		.nav-side-menu {font-size: 12px;font-weight: 200;background-color: <?php echo $args['items_color']; ?>;}
	  </style>
	  <?php
	  

	if (!empty($pageids)) {	  
		// List pages, if any. Blank title_li suppresses unwanted elements.
		$output .= wp_list_pages( Array('title_li' => '',
					'sort_column' => $args['sort_column'],
					'sort_order' => $args['sort_order'],
					'include' => $pageids,
					'exclude' => $args['exclude'],
					'walker'  => new sf_bootstrap_walker_horizontal_menu()
				) );									
		
	} else {
		$output .= wp_list_pages( Array('title_li' => '',
					'sort_column' => $args['sort_column'],
					'sort_order' => $args['sort_order'],
					'exclude' => $args['exclude'],
					'walker'  => new sf_bootstrap_walker_horizontal_menu()
				) );
	}
	
	return $output;
}

function sf_list_pages($args = '') {
    $output = '';
 	  
	if(!isset($args['exclude']) ) {
		$args['exclude'] = '';
	}
	
	if(!isset($args['sort_column'])) {
		$args['sort_column'] = '';
	}
	
      
	$output = "";
	if (isset($args['alignment']) && $args['alignment'] == '1') {
		$output = $this->list_vertical($args);
	} else {
		$output = $this->list_horizontal($args);
	 }

	$output = apply_filters('wp_list_pages', $output);
	    
  }

  /**
   * Displays the Widget
   *
   */
  function widget($args, $instance){
	
    $title = apply_filters('widget_title', empty($instance['title']) ? '' : $instance['title']);
    $known_params = $this->known_params(0);
    foreach ($known_params as $param) {
      if (isset($instance[$param]) && strlen($instance[$param])) {
		$page_options[$param] = $instance[$param];
      }
    }
          
	//Horizontal
	if(isset($instance['alignment']) && $instance['alignment'] == 2) { 
    ?>
	<nav id="dynamic_menu_row" class="navbar navbar-default" role="navigation">
		<button type="button" class="navbar-toggle pull-right" data-toggle="collapse" data-target=".nav-horizontal-menu-collapse">
			<span class="sr-only">Toggle navigation</span>
			<span >Menu</span>
		</button>
		<div class="navbar-collapse nav-horizontal-menu-collapse collapse">
			<ul id="menu-horizontal" class="nav navbar-nav">					   
			<?php $this->sf_list_pages($page_options); ?>
			</ul>
		</div>
	</nav>
	<?php
	} else {
	
	//Vertical sidemenu
	?>
	<div class="nav-side-menu">
		<?php if(!empty($title)){ ?>
		<div class="brand"><?php echo "$title"; ?></div>
		<?php } ?>
		<i class="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"></i>
		<div class="menu-list">
			<ul id="menu-content" class="menu-content collapse out">					   
			<?php $this->sf_list_pages($page_options); ?>
			</ul>
		</div>
	</div>
	<?php
	}
  }

  function known_params ($options = 0) {
	$tdom = 'sf-bootstrap-menu';
    $option_menu = array(
			'title' => array('title' => __("Title:", $tdom)),
			'alignment' => array('title' => __("Menu alignment", $tdom),
						'type' => 'select'),
			'child_of' => array('title' => __("Root pages:", $tdom),
						'desc' => __("List of root page IDs to show", $tdom)),
			'show_root' => array('title' => __("Show top-level pages:", $tdom),
					      'type' => 'checkbox'),
			'exclude' => array('title' => __("Exclude pages:", $tdom),
					    'desc' => __("List of page IDs to exclude", $tdom)),
			'sort_column' => array('title' => __("Sort field:", $tdom),
						'desc' => __("Comma-separated list: <em>post_title, menu_order, post_date, post_modified, ID, post_author, post_name</em>", $tdom)),
			'sort_order' => array('title' => __("Sort direction:", $tdom),
				       'desc' => __("(default: ASC)", $tdom)),
			'post_status' => array('title' => __("Post status:", $tdom),
						'desc' => __("(default: publish)", $tdom)),
			'title_color' => array('title' => __("Title background color:", $tdom),
						'type' => 'color',
						'value' => '#505050'),
			'items_color' => array('title' => __("Menu items background color:", $tdom),
						'type' => 'color',
						'value' => '#f2f2f2'),
			 );
    return ($options ? $option_menu : array_keys($option_menu));
  }

  /**
   * Saves the widget's settings.
   *
   */
  function update($new_instance, $old_instance){
    $instance = $old_instance;
    $known_params = $this->known_params();
    unset($instance['menu_order']);
	
    foreach ($known_params as $param) {
      $instance[$param] = strip_tags(stripslashes($new_instance[$param]));
	  
	  if($param == 'items_color' || $param == 'title_color') {
		$instance[$param]['value'] = $new_instance[$param]['value'];
	  }
	  
	  if($param == 'alignment') {
		$instance[$param] = $new_instance[$param];
	  }
	  
    }
    $instance['sort_order'] = strtolower($instance['sort_order']) == 'desc'?'DESC':'ASC';
    return $instance;
  }

  /**
   * Creates the edit form for the widget.
   *
   */
  function form($instance){
	$instance = wp_parse_args( (array) $instance, $this->defaults );

    if (isset($instance['menu_order'])) {
      $instance['sort_column'] = 'menu_order,post_title';
    }

    $option_menu = $this->known_params(1);
	$tdom = 'sf-bootstrap-menu';

	
	foreach (array_keys($option_menu) as $param) {
		$param_display[$param] = htmlspecialchars($instance[$param]);
	}

	foreach ($option_menu as $option_name => $option) {
	
		$name = $this->get_field_name($option_name);
		
		$checkval='';
		$desc = '';
		$h = '';
		$v = '';
		if (isset($option['desc']) && $option['desc']) {
		  $desc = '<br /><small>' . __($option['desc'], $tdom) . '</small>';
		}
		
		if (!isset($option['type'])) {
			$option['type'] = '';
		}
		
		switch ($option['type']) {
			case 'checkbox':
			  if ($instance[$option_name]) // special HTML and override value
				$checkval = 'checked="yes" ';
				$param_display[$option_name] = 'yes';
			  break;
			case '':
			  $option['type'] = 'text';
			  break;
		}
			
		if($option['type'] == "select") {	
?>			
			
			<p style="text-align:right;">
			<label for="<?php echo $this->get_field_name($option_name); ?>"><?php echo __($option['title'], $tdom); ?>
			<select style="width: 200px;" id="<?php echo $this->get_field_id($option_name); ?>" name="<?php echo $this->get_field_name($option_name); ?>">
			<?php for ($i=1;$i<=2;$i++) {
				echo '<option value="'.$i.'"';
				if ($i==$instance['alignment']) echo ' selected="selected"';
				if($i==1) {
					echo '>Vertical</option>';
				} else {
					echo '>Horizontal</option>';
				}
			 } ?>
			</select></label><?php echo $desc; ?></p>
<?php
		} else {
		print '<p style="text-align:right;">
			<label for="' . $this->get_field_name($option_name) . '">' . 
		  __($option['title'], $tdom) . ' 
			<input style="width: 200px;" id="' . $this->get_field_id($option_name) . '" name="' . $name . "\" type=\"{$option['type']}\" {$checkval}value=\"{$param_display[$option_name]}\" />
			</label>$desc</p>";
		  }
	}
  }
	
}

?>
