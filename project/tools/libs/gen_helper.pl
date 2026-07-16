use strict;
use warnings;

use FindBin;
use JSON;
use Digest::MD5 qw(md5_hex);
use Archive::Zip qw( :ERROR_CODES :CONSTANTS );
use File::Path;
use File::Copy;
use File::Basename;
use Thread;

my $DIR_LIBS = &D($FindBin::Bin);

# format directory
sub D ($)
{
	(local $_ = shift) =~ s/[\\\/]+/\//g;
	s/[\\\/]*$/\//;
	$_
}

sub sub_dir ($)
{
    my $dir_dst = &D(shift);
    opendir my $dir_ref, $dir_dst or die "sub_dir --> no directory: ${dir_dst}\n\n: $!";
    my @files = grep !/^\./, readdir $dir_ref;
    closedir $dir_ref;
    return @files;
}

sub sub_get_files_fullpath ($)
{
	my $dir_src = &D(shift);
	my @list;
	for (sub_dir $dir_src) {
		@list = (@list, &sub_get_files_fullpath($dir_src.$_)), next if -d $dir_src.$_;
		push @list, $dir_src.$_;
	}
	return @list;
}

sub read_file_utf8 ($)
{
    my $file_dst = shift;
	open my $fi, "<", $file_dst;
	binmode $fi, ":utf8";
	sysread $fi, my $content, -s $file_dst;
	close $fi;
	return $content;
}

sub read_file ($)
{
    my $file_dst = shift;
	open my $fi, "<", $file_dst;
	sysread $fi, my $content, -s $file_dst;
	close $fi;
	return $content;
}

sub write_file_utf8 ($)
{
	my ($file_dst, $content) = (shift, shift);
	open my $fo, ">", $file_dst;
	binmode $fo, ":utf8";
	syswrite $fo, $content;
	close $fo;
}

sub write_file ($)
{
	my ($file_dst, $content) = (shift, shift);
	open my $fo, ">", $file_dst;
	syswrite $fo, $content;
	close $fo;
}

sub sub_get_md5 ($)
{
	my $file_name = shift;
	open my $data, '<', $file_name or die "sub get md5 --> no such file: ${file_name}\n\n: $!";
	binmode $data;
	my $md5 = Digest::MD5->new->addfile($data)->hexdigest;
	close $data;
	return $md5;
}

sub sub_get_suffix ($)
{
	my $suffix = "empty";
	my $file_name = shift;
	if ($file_name =~ /^(.*)\.([A-Za-z0-9]+)$/)
	{
		$suffix = $2;
	}
	return $suffix;
}

sub sub_get_foldername ($)
{
	my @names = split("/", &D(shift));
	my $len = @names;
	return $names[$len - 1];
}

sub sub_print_dir ($)
{
	my $dir_dst = &D(shift);

	-d $dir_dst or die;
	for (sub_dir $dir_dst)
	{
		my $file_name = $_;
		my $file_dst = $dir_dst.$file_name;
		if (-d $file_dst)
		{
			&sub_print_dir($file_dst);
		}
		else
		{
			print $file_dst, "\n";
		}
	}
}

sub sub_print_zhcn ($)
{
	print encode('gb2312', shift);
}

sub get_bv () {
	my $t = localtime(time);
	return sprintf "%04d%02d%02d", 1900 + $t->year, 1 + $t->mon, $t->mday;
}

sub get_sv () {
	my $out = `subwcrev "${DIR_LIBS}../../../"`;
	$out =~ /revision\s*(\d+)/s;
	return $1;
}

# 以上是辅助工具函数#############################################################################################################
# 以上是辅助工具函数#############################################################################################################
# 以上是辅助工具函数#############################################################################################################
# 以上是辅助工具函数#############################################################################################################
# 以上是辅助工具函数#############################################################################################################

sub delsuffixfile ($$)
{
	my ($dir_dst, $suffix) = (&D(shift), shift);
	for (sub_dir $dir_dst)
	{
		my $file_name = $_;
		my $file_dst = $dir_dst.$file_name;

		if (-d $file_dst)
		{
			&delsuffixfile($file_dst, $suffix);
		}
		else
		{
			if ($file_name =~ /^(.*)\.(${suffix})$/i)
			{
				unlink $file_dst or die;
			}
		}
	}
}

sub sub_delsuffixfile ()
{	
	my ($dir_dst, $suffix) = ("", "");
	while(my $option = shift @_)
	{
		if(lc($option) eq '-dir_dst')
		{
			$dir_dst = shift @_ or die "value expected: $option\n\n";
		}
		elsif(lc($option) eq '-suffix')
		{
			$suffix = shift @_ or die "value expected: $option\n\n";
		}
		else
		{
			die "unknown option: $option\n\n";
		}
	}
	
	-d $dir_dst or die;
	&delsuffixfile($dir_dst, $suffix);
}

sub xmltojsoniter ($$)
{
	my ($dir_src, $dir_dst) = (&D(shift), &D(shift));
	
	-d $dir_src or die;
	if (!-d $dir_dst)
	{
		mkpath $dir_dst, 1 or die;
	}

	for (sub_dir $dir_dst)
	{
		my ($file_src, $file_dst) = ($dir_src.$_, $dir_dst.$_);
		$file_src =~ s/\.meta//;
		$file_src =~ s/\.json/\.xml/;
		if (-f $file_dst && !-f $file_src)
		{
			unlink $file_dst or die;
		}
		elsif(-d $file_dst && !-d $file_src)
		{
			rmtree $file_dst, 1 or die;
		}
	}
	
	for (sub_dir $dir_src)
	{
		my $file_name = $_;
		my ($file_src, $file_dst) = ($dir_src.$file_name, $dir_dst.$file_name);

		if (-d $file_src)
		{
			&xmltojsoniter($file_src, $file_dst);
		}
		else
		{
			if ($file_name =~ /^(.*)\.(xml)$/)
			{
				my $json_name = $file_name;
				$json_name =~ s/\.xml/\.json/;
				print "xmltojson ${file_name} -> ${json_name}\n";
				die if system "${DIR_LIBS}lua.exe ${DIR_LIBS}gen_script.lua xmltojson $dir_src $dir_dst $file_name $json_name";
			}
		}
	}
}

sub sub_xmltojson ()
{	
	my ($dir_src, $dir_dst) = ("", "");
	while(my $option = shift @_)
	{
		if(lc($option) eq '-dir_src')
		{
			$dir_src = shift @_ or die "value expected: $option\n\n";
		}
		elsif(lc($option) eq '-dir_dst')
		{
			$dir_dst = shift @_ or die "value expected: $option\n\n";
		}
		else
		{
			die "unknown option: $option\n\n";
		}
	}
	
	-d $dir_src or die;
	-d $dir_dst or die;
	
	&xmltojsoniter($dir_src, $dir_dst);
}

my @threads_paths;
my $THREADS_MAX = 1;
my $threads_idx = 0;
sub sub_pngquant_thread ($)
{
	my $i = shift;
	my @thread_paths = @{$threads_paths[$i]};
	foreach (@thread_paths) {
		my $file_dst = $_;
		print("pngquant_thread${i} -> ${file_dst}\n");
		# die if system "${DIR_LIBS}pngquant.exe --speed 1 --skip-if-larger --force --nofs --ext .png ${file_dst}";
		# system "${DIR_LIBS}pngquant.exe --speed 1 --skip-if-larger --force --nofs --ext .png ${file_dst}";
		system "${DIR_LIBS}pngquant.exe --quality=80-100 --skip-if-larger --nofs --ext=.png --force ${file_dst}";
	}
}

sub sub_pngquantall ($)
{
	my $dir_dst = &D(shift);

	-d $dir_dst or die;
	for (sub_dir $dir_dst)
	{
		my $file_name = $_;
		my $file_dst = $dir_dst.$file_name;

		if (-d $file_dst)
		{
			&sub_pngquantall($file_dst);
		}
		else
		{
			if ($file_name =~ /^(.*)\.(png)$/)
			{
				push @{$threads_paths[$threads_idx]}, $file_dst;
				$threads_idx++;
				if ($threads_idx >= $THREADS_MAX) {
					$threads_idx = 0;
				}
			}
		}
	}
}

sub sub_pngquant ()
{	
	my $dir_dst = "";
	while(my $option = shift @_)
	{
		if(lc($option) eq '-dir_dst')
		{
			$dir_dst = shift @_ or die "value expected: $option\n\n";
		}
		elsif(lc($option) eq '-tmax')
		{
			$THREADS_MAX = shift @_ or die "value expected: $option\n\n";
			$THREADS_MAX = $THREADS_MAX + 0;
			($THREADS_MAX >= 1 && $THREADS_MAX <= 16) or die "value expected: $option must 1-16\n\n";
		}
		else
		{
			die "unknown option: $option\n\n";
		}
	}
	
	-d $dir_dst or die;
	
	for(my $i = 0; $i < $THREADS_MAX; $i++){
		push @threads_paths, [];
	}
	
	&sub_pngquantall($dir_dst);
	
	my $time_start = time();
	my @threads;
	# for(my $i = 0; $i < scalar @threads_paths; $i++){
	for(my $i = 0; $i < $THREADS_MAX; $i++){
		push @threads, threads->new(\&sub_pngquant_thread, $i);
	}
	foreach (@threads) {
		my $val = $_->join();
	}
	my $time_end = time();
	my $time_elapsed = $time_end - $time_start;
	print("pngquant elapsed time ${time_elapsed}s\n");
}

sub sub_movetocache ()
{	
	my $dir_dst = "";
	while(my $option = shift @_)
	{
		if(lc($option) eq '-dir_dst')
		{
			$dir_dst = shift @_ or die "value expected: $option\n\n";
		}
		else
		{
			die "unknown option: $option\n\n";
		}
	}
	
	-d $dir_dst or die;
	$dir_dst = &D($dir_dst);

	# 定义目录常量
	my $NAME_MANIFEST_JSON = "manifest.json";
	my $NAME_DEFAULT_RES_JSON = "default.res.json";
	my $NAME_DEFAULT_THM_JSON = "default.thm.json";
	my $NAME_CACHE = "cache";

	my $DIR_JS = &D("${dir_dst}js");
	my $DIR_RESOURCE = &D("${dir_dst}resource");
	my $FILE_MANIFEST_JSON = $dir_dst.$NAME_MANIFEST_JSON;

	my $FILE_DEFAULT_RES_JSON = $DIR_RESOURCE.$NAME_DEFAULT_RES_JSON;
	my $FILE_DEFAULT_THM_JSON = $DIR_RESOURCE.$NAME_DEFAULT_THM_JSON;
	my $DIR_CACHE = &D($DIR_RESOURCE.$NAME_CACHE);

	# 找到main.min_xxxxxx.js文件名
	my $NAME_MAIN_MIN_JS = "";
	my $FILE_MAIN_MIN_JS = "";
	for (sub_dir $DIR_JS)
	{
		my $file_name = $_;
		if ($file_name =~ /^(main\.min_)([A-Za-z0-9]+)\.(js)$/)
		{
			$NAME_MAIN_MIN_JS = $file_name;
			$FILE_MAIN_MIN_JS = $DIR_JS.$NAME_MAIN_MIN_JS;
		}
	}


	# 建立空的cache目录用于存放后续文件
	print("Do mkdir [${NAME_CACHE}] ####################################\n");
	if (-d $DIR_CACHE)
	{
		rmtree($DIR_CACHE) or die "can not rmtree ${DIR_CACHE}";
	}
	mkdir($DIR_CACHE) or die "can not mkdir ${DIR_CACHE}";
	print("\n");


	# 读取default.res.json文件内容，并重命名所有资源名，后移动至cache目录，最后修改default.res.json中的引用
	print("Rename and move all files in [${NAME_CACHE}] and update [${NAME_DEFAULT_RES_JSON}] ####################################\n");
	if (1)
	{
		my $content_drj = &read_file($FILE_DEFAULT_RES_JSON);
		my $json = JSON->new->utf8;
		my $json_drj = $json->decode($content_drj);
		for my $item(@{$json_drj->{'resources'}})
		{
			my $url = $item->{'url'};
			my $file_path = $DIR_RESOURCE.$url;
			my $file_md5 = &sub_get_md5($file_path);
			my $file_suffix = &sub_get_suffix($url);
			my $new_name = "${file_md5}.${file_suffix}";
			my $new_path = $DIR_CACHE.$new_name;

			print("move ${url} => ${new_name}\n");
			move($file_path, $new_path);

			$content_drj =~ s/$url/$NAME_CACHE\/$new_name/g;
		}
		&write_file($FILE_DEFAULT_RES_JSON, $content_drj);
	}
	print("\n");


	# 输出并清除resource下（除cache目录）目录中的残留文件
	print("This files are not in [${NAME_DEFAULT_RES_JSON}] ####################################\n");
	if (1)
	{
		for (sub_dir $DIR_RESOURCE)
		{
			my $file_name = $_;
			my $file_dst = $DIR_RESOURCE.$file_name;
			if (-d $file_dst && $file_name ne $NAME_CACHE)
			{
				&sub_print_dir($file_dst);
				rmtree($file_dst) or die "can not rmtree ${file_dst}";
			}
		}
	}
	print("\n");


	# 重命名default.res.json，并修改main.min_xxxxxx.js中的引用
	# 重命名default.thm.json，并修改main.min_xxxxxx.js中的引用
	print("Rename [${NAME_DEFAULT_RES_JSON}] and [${NAME_DEFAULT_THM_JSON}] and update [${NAME_MAIN_MIN_JS}] ####################################\n");
	if (1)
	{
		my $md5_drj = &sub_get_md5($FILE_DEFAULT_RES_JSON);
		my $suffix_drj = &sub_get_suffix($NAME_DEFAULT_RES_JSON);
		my $name_drj = "${md5_drj}.${suffix_drj}";
		rename $FILE_DEFAULT_RES_JSON, $DIR_RESOURCE.$name_drj;

		my $md5_dtj = &sub_get_md5($FILE_DEFAULT_THM_JSON);
		my $suffix_dtj = &sub_get_suffix($NAME_DEFAULT_THM_JSON);
		my $name_dtj = "${md5_dtj}.${suffix_dtj}";
		rename $FILE_DEFAULT_THM_JSON, $DIR_RESOURCE.$name_dtj;

		my $content_mnj = &read_file($FILE_MAIN_MIN_JS);
		$content_mnj =~ s/$NAME_DEFAULT_RES_JSON/$name_drj/g;
		$content_mnj =~ s/$NAME_DEFAULT_THM_JSON/$name_dtj/g;
		&write_file($FILE_MAIN_MIN_JS, $content_mnj);
	}
	print("\n");


	# 重命名main.min_xxxxxx.js，并修改manifest.json中的引用
	print("Rename [${NAME_MAIN_MIN_JS}] and update [${NAME_MANIFEST_JSON}] ####################################\n");
	if (1)
	{
		my $md5_mnj = &sub_get_md5($FILE_MAIN_MIN_JS);
		my $name_mnj = "main.min_${md5_mnj}.js";
		rename $FILE_MAIN_MIN_JS, $DIR_JS.$name_mnj;

		my $content_mfj = &read_file($FILE_MANIFEST_JSON);
		$content_mfj =~ s/$NAME_MAIN_MIN_JS/$name_mnj/g;
		&write_file($FILE_MANIFEST_JSON, $content_mfj);
	}
	print("\n");
}

sub sub_collectviewall ($)
{
	my ($dir_dst, $nameList) = (&D(shift), shift);

	-d $dir_dst or die;
	for (sub_dir $dir_dst)
	{
		my $file_name = $_;
		my $file_dst = $dir_dst.$file_name;

		if (-d $file_dst)
		{
			&sub_collectviewall($file_dst, $nameList);
		}
		else
		{
			if ($file_name =~ /^(.*)\.(ts)$/)
			{
				open my $file, "<", $file_dst;
				foreach my $line (<$file>){
					if ($line =~ /class\s+(\w+)\s+extends\s+ViewLayer/){
						push @$nameList, $1;
						print $1, "\n";
					}
				}
				close $file;
			}
		}
	}
}

sub sub_collectview ()
{	
	my ($dir_dst, $file_dst) = ("", "");
	while(my $option = shift @_)
	{
		if(lc($option) eq '-dir_dst')
		{
			$dir_dst = shift @_ or die "value expected: $option\n\n";
		}
		elsif(lc($option) eq '-file_dst')
		{
			$file_dst = shift @_ or die "value expected: $option\n\n";
		}
		else
		{
			die "unknown option: $option\n\n";
		}
	}
	
	-d $dir_dst or die;
	
	my @nameList = [];
	&sub_collectviewall($dir_dst, \@nameList);
	
	my $content_src1 = "";
	my $content_src2 = "";
	foreach (@nameList)
	{
		# 为什么会有数组类型的呢？过滤一下
		if (ref \$_ eq "SCALAR") {
			if ($content_src1 eq "") {
				$content_src1 = $content_src1."if (viewName == \"${_}\") {return new ${_}()}\n";
				$content_src2 = $content_src2."if (viewName == \"${_}\") {return ${_}.onViewResArray()}\n";
			}
			else {
				$content_src1 = $content_src1."else if (viewName == \"${_}\") {return new ${_}()}\n";
				$content_src2 = $content_src2."else if (viewName == \"${_}\") {return ${_}.onViewResArray()}\n";
			}
		}
	}
	
	my $content_val = &read_file($file_dst);
	$content_val =~ s/\/\/REPLACE_A_START[^#]*#/\/\/REPLACE_A_START\n$content_src1\/\/REPLACE_A_END#/g;
	$content_val =~ s/\/\/REPLACE_B_START[^#]*#/\/\/REPLACE_B_START\n$content_src1\/\/REPLACE_B_END#/g;
	&write_file($file_dst, $content_val);
	
	# open my $fo, ">", $file_dst;
	# binmode $fo;
	# syswrite $fo, $content_src1."\n\n\n".$content_src2;
	# close $fo;
}

sub sub_errorcode ()
{	
	my ($src_path, $com_path, $val_path, $str_path, $sv) = ("", "", "", "", 0);
	while(my $option = shift @_)
	{
		if(lc($option) eq '-src_path')
		{
			$src_path = shift @_ or die "value expected: $option\n\n";
		}
		elsif(lc($option) eq '-com_path')
		{
			$com_path = shift @_ or die "value expected: $option\n\n";
		}
		elsif(lc($option) eq '-val_path')
		{
			$val_path = shift @_ or die "value expected: $option\n\n";
		}
		elsif(lc($option) eq '-str_path')
		{
			$str_path = shift @_ or die "value expected: $option\n\n";
		}
		elsif(lc($option) eq '-sv')
		{
			$sv = shift @_ or die "value expected: $option\n\n";
		}
		else
		{
			die "unknown option: $option\n\n";
		}
	}
	$sv = &get_sv() or 0 if $sv == 0;
	
	-f $src_path or die;
	-f $com_path or die;
	-f $val_path or die;
	-f $str_path or die;
	
	my $content_src1 = "";
	my $content_src2 = "";
	
	if (1) {
	open(FILE, "<", $src_path) || die "cannot open the file: $src_path\n";
	my @linelist = <FILE>;
	foreach (@linelist) {
		if ($_ =~ /\s*(\w+)\s*=\s*(\d+)\s*,\s*--\s*(\S+)/){
			# print "###${1}###";
			# print "\n";
			# print "###${2}###";
			# print "\n";
			# print "###${3}###";
			# print "\n";
			$content_src1 = $content_src1."\tstatic ${1} = ${2}; // ${3}\n";
			$content_src2 = $content_src2."StrVal.ERRCODE[PErrCode.${1}] = \"${3}\";\n";
		}
	}
	close FILE;
	}
	
	if (1) {
	open(FILE, "<", $com_path) || die "cannot open the file: $com_path\n";
	my @linelist = <FILE>;
	foreach (@linelist) {
		if ($_ =~ /\s*h.version\s*=\s*(\S+)\s*/){
			$content_src1 = "\tstatic content_version = ${1};\n".$content_src1;
			$content_src1 = "\tstatic svn_version = \"${sv}\";\n".$content_src1;
			# break;
		}
	}
	close FILE;
	}
	
	my $content_val = &read_file($val_path);
	$content_val =~ s/\/\/SERVER_START[^}]*}$/\/\/SERVER_START\n$content_src1\/\/SERVER_END\n}/g;
	&write_file($val_path, $content_val);
	
	$content_val = &read_file($str_path);
	$content_val =~ s/\/\/SERVER_START[^}]*}$/\/\/SERVER_START\n$content_src2\/\/SERVER_END}/g;
	&write_file($str_path, $content_val);
}

sub sub_genprotobin ()
{	
	my ($dir_src, $dir_dst) = ("", "");
	while(my $option = shift @_)
	{
		if(lc($option) eq '-dir_src')
		{
			$dir_src = shift @_ or die "value expected: $option\n\n";
		}
		elsif(lc($option) eq '-dir_dst')
		{
			$dir_dst = shift @_ or die "value expected: $option\n\n";
		}
		else
		{
			die "unknown option: $option\n\n";
		}
	}
	
	-f $dir_src or die;
	
	die if system "${DIR_LIBS}lua.exe ${DIR_LIBS}gen_script.lua genprotobin $dir_src $dir_dst";
}

sub sub_genpackage ()
{
	my ($dir_src, $dir_dst, $sv) = ("", "", 0);
	while(my $option = shift @_)
	{
		if(lc($option) eq '-dir_src')
		{
			$dir_src = shift @_ or die "value expected: $option\n\n";
		}
		elsif(lc($option) eq '-dir_dst')
		{
			$dir_dst = shift @_ or die "value expected: $option\n\n";
		}
		else
		{
			die "unknown option: $option\n\n";
		}
	}
	-d $dir_src or die;
	-d $dir_dst or die;
	
	my $dir_subdata = "android/data/";
	# 写入SVN版本号文件
	$sv = &get_sv() or 0 if $sv == 0;
	&write_file("${dir_src}${dir_subdata}verlast.txt", "${sv}");
	# 读取加塞的js脚本
	my $main_flag = "// SystemJS support.";
	my $main_add = &read_file("${dir_src}android_tools/main.js");
	# 读取导出的js脚本
	my $main_src = &read_file("${dir_src}${dir_subdata}main.js");
	# 重写导出的js脚本
	my $idx = index($main_src, $main_flag, 0);
	$main_src = substr($main_src, $idx, length($main_src) - $idx);
	&write_file("${dir_src}${dir_subdata}main.js", "${main_add}${main_src}");
	# 压缩整个文件夹
	my $zip = Archive::Zip->new();
	for (&sub_get_files_fullpath("${dir_src}${dir_subdata}"))
	{
		if ($_ =~ /^(.*)\.(pl)$/)
		{
			# do nothing
			next;
		}
		else
		{
			my $zip_path = $_;
			my $idx = index($zip_path, $dir_subdata, 0) + length($dir_subdata);
			$zip_path = substr($zip_path, $idx, length($zip_path) - $idx);
			print "gen zip --> file: ${zip_path}\n";
			$zip->addFile($_, $zip_path) or die;
		}
	}
	# 也可以直接写进zip简单点
	# $zip->addString("${sv}", "${dir_src}${dir_subdata}verlast.txt") or die;
	
	my @mems = $zip->members();
	for (@mems)
	{
		# 使用 COMPRESSION_STORED 既是 Level 0
		# 使用 COMPRESSION_DEFLATED 既是 Level 6
		# 可以直接使用数字 Level range(0 - 9) 数值越大解压和压缩的速度越慢
		$_->desiredCompressionMethod(COMPRESSION_DEFLATED);
	}
	$zip->writeToFileNamed("${dir_dst}${sv}\.zip") == AZ_OK or die;
}

sub sub_createpatch ($$$$)
{	
	my ($dir_src, $dir_dst, $version_old, $version_new) = (shift, shift, shift, shift);
	
	print "Create ${version_old}_${version_new}.zip\n";
	
	my $zip = Archive::Zip->new();
	
	my $zip_old = Archive::Zip->new();
	$zip_old->read("${dir_src}${version_old}.zip");
	
	my $zip_new = Archive::Zip->new();
	$zip_new->read("${dir_src}${version_new}.zip");
	my @members = $zip_new->members();
	for (@members)
	{
		next if ($_->isDirectory());
		
		my $path = $_->fileName();
		
		my ($content_new, $status_new) = $_->contents();
		my ($content_old, $status_old) = $zip_old->contents($path);
		# if ($status_old && $status_old == AZ_OK)
		if ($content_old)
		{
			my $md5_old = Digest::MD5->new->add($content_old)->hexdigest;
			my $md5_new = Digest::MD5->new->add($content_new)->hexdigest;
			if ($md5_new ne $md5_old)
			{
				print "M ${path}\n";
				$zip->addString($content_new, $path) or die;
			}
		}
		else
		{
			print "C ${path}\n";
			$zip->addString($content_new, $path) or die;
		}
	}
	
	my @mems = $zip->members();
	for (@mems)
	{
		$_->desiredCompressionMethod(COMPRESSION_DEFLATED);
	}
	my $patch_zip_name = "${dir_dst}${version_old}_${version_new}\.zip";
	$zip->writeToFileNamed($patch_zip_name) == AZ_OK or die;
}

sub sub_genpatches ()
{
	my ($dir_src, $dir_dst) = ("", "");
	while(my $option = shift @_)
	{
		if(lc($option) eq '-dir_src')
		{
			$dir_src = shift @_ or die "value expected: $option\n\n";
		}
		elsif(lc($option) eq '-dir_dst')
		{
			$dir_dst = shift @_ or die "value expected: $option\n\n";
		}
		else
		{
			die "unknown option: $option\n\n";
		}
	}
	-d $dir_src or die;
	-d $dir_dst or die;
	
	my $PATCH_LIST_TXT = "${dir_dst}PATCH_LIST\.txt";
	&write_file($PATCH_LIST_TXT, "");
	my $content_list = &read_file($PATCH_LIST_TXT);
	
	my $version_max = "0";
	my @suffixlist = qw(.zip .rar);
	for (&sub_get_files_fullpath($dir_src))
	{
		my ($name, $path, $suffix) = fileparse($_, @suffixlist);
		if ($name > $version_max)
		{
			$version_max = $name;
		}
	}
	for (&sub_get_files_fullpath($dir_src))
	{
		my ($name, $path, $suffix) = fileparse($_, @suffixlist);
		if ($name ne $version_max)
		{
			&sub_createpatch($dir_src, $dir_dst, $name, $version_max);
			# 写入版本号和MD5
			my $patch_zip_name = "${dir_dst}${name}_${version_max}\.zip";
			my $md5_zip = &sub_get_md5($patch_zip_name);
			$content_list = "${content_list}\n\t\t\{\"ver\": \"${name}\", \"md5\": \"${md5_zip}\"\},";
		}
	}
	# 写入版本号和MD5
	$content_list = "${content_list}\n\t\t\{\"ver\": \"${version_max}\", \"md5\": \"0\"\}";
	&write_file($PATCH_LIST_TXT, $content_list);
}

# all commands
my %COMMAND =
(
	delsuffixfile => \&sub_delsuffixfile,
	xmltojson => \&sub_xmltojson,
	pngquant => \&sub_pngquant,
	movetocache => \&sub_movetocache,
	collectview => \&sub_collectview,
	errorcode => \&sub_errorcode,
	genprotobin => \&sub_genprotobin,
	genpackage => \&sub_genpackage,
	genpatches => \&sub_genpatches,
);

my $command_word = lc(shift @ARGV || 'empty');
($COMMAND{$command_word} or die "unknown command: ${command_word}\n\n")->(@ARGV);