
window.onload = init;

function init()
{
    document.getElementById("transferButton").addEventListener("click", checkLanguage, false);
}


function replace( string, oldSubStr, newSubStr )
// string�r�ꤤ�Z�ŦXoldSubStr���A������newSubStr
{
  return string.replace( new RegExp( oldSubStr,"gm"), newSubStr ) ;
}

function getTextareaRow()
// ���otextarea�ثe�����
{
  i = form1.txtTest.value.match(/\n/g) ; 
  
  var txtlen = 1 ;
  
  if ( i )
    txtlen = i.length + 1 ; 
	
  return txtlen ;
}

function getLineHTMLCode()
// ���o��ƪ�html�X
{
  var n = getTextareaRow() ;
  var str = "" ;
  
  for ( i = 1 ; i < n+1 ; i ++ )
    str += "" + i + "\n" ;

  return str ;
}

function getHTMLCode() 
// ���o�̫᪺�{���X�A�i�H�����K�b�����W
{
  var str = "" ;
  /* // table�榡�A���Nfloat�A���T�w�榡���u�I�A���|�]��scroll�X�{�P�_�ӧ��ܦ渹�����סA�ݭn�t�~�ק�C
  str = '<!--�{���X�}�l--><div><table><tr><td><pre class=\"codeStyle\" style=\"width:30px; height:auto; background-color:lightslategray; color:white ; TEXT-ALIGN:center \">'
       + getLineHTMLCode() 
	   + '</pre></td><td>' 
       + '<pre class=\"codeStyle\" style=\"width:540px \">' 
	   + form1.txtTest2.value 
	   + '</pre></td></tr></table></div><!--�{���X����-->' ;
*/
    str = '<!--�{���X�}�l--><pre class=\"codeStyle\" style=\"float:left; width:30px; height:auto; background-color:lightslategray; color:white ; TEXT-ALIGN:center; \">'
       + getLineHTMLCode() 
	   + '</pre>' 
       + '<pre class=\"codeStyle\" style=\"float:left; width:540px; \">' 
	   + form1.txtTest2.value 
	   + '</pre><!--�{���X����-->' ;
	   
  return str ;	   
}

function checkLanguage() 
// �ؿ���ǻy���A�N�����ǻy�����ˬd
{
  var string = form1.txtTest.value ;
  var shouldTranslate = true ;
  var oTextCount = document.getElementById("txtCount2") ; // �]�˦�����
  
  if ( form1.HTML.checked && form1.JAVASCRIPT.checked && form1.CPP.checked ) {
    resultOfHTML() ;
    resultOfCpp() ;
	resultOfJavaScript() ;
  }   
  else if ( form1.HTML.checked && form1.JAVASCRIPT.checked ) {
    resultOfHTML() ;
	resultOfJavaScript() ;
  }  
  else if ( form1.HTML.checked )
    resultOfHTML() ;
  else if ( form1.JAVASCRIPT.checked )
    resultOfJavaScript() ;
  else if ( form1.CPP.checked ) {
    resultOfCpp() ;
  }
  else {
    shouldTranslate = false ;
    // alert( "NO HTML & NO JAVASCRIPT" ) ;
	oTextCount.innerHTML = "NO HTML & NO JAVASCRIPT" ;
  }
  if ( shouldTranslate ) {
    form1.txtTest2.value = getHTMLCode() ; // ���ܺ����WtxtCount����
    oTextCount.innerHTML = form1.txtTest2.value ; // ���ܺ����WtxtCount����
  }
  shouldTranslate = true ;
}

function deleteString( string, deleteString )
// �Nstring���ŦXdeleteString���r������R��
{
  return string.replace( new RegExp(deleteString,"gm"),"" ) ; 
}

function replaceString( string, oldString, newString )
// �Nstring���ŦXoldString���r�����������newString
{
  return string.replace( new RegExp(oldString,"gm"), newString ) ; 
}

function substr( string, start, end )
// ���N���ت�substr
{
  var str = "" ;
  
  for ( i = start ; i < end ; i ++ ) {
    str += string.charAt( i ) ;
  }
  return str ;
}

function deleteTag( string, start, end )
// ��d�򤺩Ҧ������ҲM�����b
{
  var stringSub = substr( string, start, end ) ;
  //var stringSub =  string.substr( start, end ) ;
  var oldStringSub = stringSub ;

  stringSub = deleteString( stringSub, '<span class="tag">' ) ;
  stringSub = deleteString( stringSub, '<span class="quot">' ) ;
  stringSub = deleteString( stringSub, '<span class="reservedWord">' ) ;
  stringSub = deleteString( stringSub, '<span class="note">' ) ;
  stringSub = deleteString( stringSub, '<span class="define">' ) ;
  stringSub = deleteString( stringSub, "</span>" ) ;

  return string.replace( oldStringSub, stringSub ) ;
}

function replaceSubStr( string, oldString, newString, start, end )
// ��d�򤺩Ҧ����ŦX�r���������
{
  var stringSub = substr( string, start, end ) ;
  //var stringSub =  string.substr( start, end ) ;
  var oldStringSub = stringSub ;

  stringSub = replaceString( stringSub, oldString, newString ) ;

  return string.replace( oldStringSub, stringSub ) ;
}

function doNoteOLD( string ) 
// �ˬd�{���X�����L "//" �`�ѲŸ��A�Y���A�K���Y�z�B�z
{
  
  var over = false ;
  var now = 0 ; 
  var now2 = 0 ;
  var nowOld = 0 ;
  var count = 0 ;
  var timeOut = 0 ;
  var stringSub = "" ;
  var stringSub2 = "" ;
  var str = "" ;  // �ΨӳB�z���Ѹ̭�������
  var str2 = "" ; // �ΨӳB�z���Ѹ̭�������
  
  // �ץ�sites�|�ର���Ѫ�bug
  string = replace( string, '://', ':/<b></b>/' ) ;
  
  // �ץ����h�Ÿ��N�q�᪺bug
  // string = replace( string, '//', '\/<b></b>/' ) ;
  
  for ( i=0 ; !over ; i = now2 + 1 ) {
    now = string.indexOf( "//" ,now ) ;
	nowOld = now ;
	
	if ( now == -1 || timeOut > 50 )
	  over = true ;
	else {
	  stringSub = string.substr( now, 20 ) ; // �Ӥ֦r���|�]����O���r�꭫�|�ӵo�ͻ~�P
	  stringSub2 = stringSub ;
	  
	  string = string.replace( stringSub2, '<span class="note">' + stringSub ) ; // �u���Ĥ@��
	  now = now + 8 ; // �]���h�F<note>//�o�K�Ӧr��
	  
	  stringSub = string.substr( now, 400 ) ; // �]���u��Ĥ@�ӡA�ҥH�d���h�j���S���Y
	  stringSub2 = stringSub ;
	  
	  now2 = string.indexOf( "\n", now ) ;
	  
	  string = deleteTag( string, now, now2 ) ; // ����Ѥ�����L�C����ҥ�����
	  
	  stringSub = string.substr( now, 400 ) ;
	  stringSub2 = stringSub ;
	  stringSub = stringSub.replace( "\n", "</span> \n" ) ; // �u���Ĥ@��(��bdeleteTag�᭱�O�ȳQ�屼</span>
	  string = string.replace( stringSub2, stringSub ) ;
  
	  if ( now2 != -1 )
	    now = now2 ;
	  
	  count ++ ;
	  timeOut ++ ;
	}
  }
  return string ;
}

function subLength( oldLength, newLength )
{
  return oldLength - newLength ;
}

function doQuotIn( string, quotStr )
// �B�z�r�ꪺ�Ӹ`����
{
  var over = false ;
  var i, start = 0, end = 0, tempLength ;
  var tempStr = "", tempStr2 = "" ;  
  var oldStringLength = 0, newStringLength = 0 ;
  var oldSubStr = "", newSubStr = "" ;
  
  // ���U�@�ӭӧ�A����䤣�쬰��]�䤣��-> start=-1 �^
  for ( i = 0 ; end > -1 ; i = end + 1 ) {  
    start = string.indexOf( quotStr, i ) ; // ���o�Ĥ@�ӡ�����m
	
	if ( string.substr( start+quotStr.length, 3 ) == '/gi' )
		start = string.indexOf( quotStr, start+4 ) ; // �o������A���s���o�Ĥ@�ӡ�����m
	
    if ( start > 0 ) {
      end = string.indexOf( quotStr, start + 1 ) ; // ��ĤG�ӡ�����m
      if ( end-start > 260 )
        end = start + 260 ; // �p�����ѨM���g�{���X�|�y���@�ǵ����ܦ�/<b></B
    }
    else
      end = -1 ;
	  
    if ( start > 0 && end > 0 ) { // �����H""�]�Ъ��r��
	
	  // �qstart�}�l�A���yend-start + quotStr.length�z���ת��r��
      tempStr = string.substr( start, end-start + quotStr.length ) ;  
      //alert( "tempStr = " + tempStr ) ;
      
	  //alert( tempStr + "      \n[" + string +  "]" ) ;
      string = string.replace( tempStr, '<span class="quot">' + tempStr + '</span>' ) ;
				  
	  // �קK�o�ͲĤ@�Ӧr����<�����p�]�|�o�Ϳ��~�^	
	  if ( string.substr( start + 19 + quotStr.length, 1 ) != '<' &&
          string.substr( start + 19 + quotStr.length, 1 ) != '&'	  ) {
		// <span class="quot">�����׬�19
		tempStr2 = string.substr( start + 19, quotStr.length + 1 ) +
                 '<b></b>' +
                 string.substr( start+19+quotStr.length+1 , tempStr.length-quotStr.length-1 ) ; 
	  }
	  else {
		tempStr2 = string.substr( start + 19, quotStr.length ) +
                 '<b></b>' +
                 string.substr( start+19+quotStr.length, tempStr.length-quotStr.length ) ; 
	  }
		
      string = string.replace( tempStr, tempStr2 ) ;
      
      oldStringLength = string.length ;
	  
	  // 7: <b></b>������
      string = deleteTag( string, start + 19, end + 19 + 7 ) ;

      newStringLength = string.length ;
      
      tempLength = subLength( oldStringLength, newStringLength ) ;
 
      string = replaceSubStr( string, '//', '/<b></b>/', start, end + 26 - tempLength ) ;

      newStringLength = string.length ;
      
	  // '<span class="quot">' + '</span>'������ = 26
      end += 26 + 7 - subLength( oldStringLength, newStringLength ) ; 
    
    } 
    
  }
      
  return string ;
}

function doQuot( string ) 
// �B�z�r��
{
  string = doQuotIn( string, '&quot;' ) ; // ���B�z����
  string = doQuotIn( string, '&#039;' ) ; // �A�B�z����
  return string ;
}

function doNote( string )
{
  // �ץ�sites�|�ର���Ѫ�bug
  string = replace( string, '://', ':/<b></b>/' ) ;
  
  string = doNoteIn( string, '//' ) ;
  
  return string ;

}

function doNoteIn( string, noteStr )
// �B�z���Ѫ��Ӹ`����
{
  var over = false ;
  var i, start = 0, end = 0 ;
  var tempStr = "", noteEndStr = "", tempStr2 = "" ;  
  var stringOldLength = 0, stringNewLength = 0 ;
  
  if ( noteStr == '//' )
    noteEndStr = '\n' ;
  else if ( noteStr == '\*' )
    noteEndStr = '*/' ;
  else
    alert( "noteStr Error : " + noteStr ) ; // �X���Y���Xĵ�i����
  
  for ( i = 0 ; end > -1 ; i = end + 1 ) {
    start = string.indexOf( noteStr, i ) ;
	
    if ( start > 0 )
      end = string.indexOf( noteEndStr, start + 1 ) ;
    else
      end = -1 ;
	  
    if ( start > 0 && end > 0 ) { // �������Ѥ����r��
      tempStr = string.substr( start, end - start + noteStr.length - 1 ) ; 
      
      string = string.replace( tempStr, '<span class="note">' + tempStr + '</span>' ) ;
      
      stringOldLength = string.length ;
      
	  //alert( string.substr( start+19, end-start+1 ) ) ;
      string = deleteTag( string, start+19, end+19 ) ; // ����Ѥ�����L�C����ҥ�����
      
      tempStr2 = string.substr( start + 19, noteStr.length + 1 ) +
                 '<B></B>' +
                 string.substr( start + 19 + noteStr.length + 1 , tempStr.length - 3 ) ; 
				 
      //alert( tempStr2 ) ;
      string = string.replace( tempStr, tempStr2 ) ;
      
      stringNewLength = string.length ;
      
	  // '<span class="quot">' + '</span>'������ = 26
      end += 26 - ( stringOldLength - stringNewLength ) ; 
    } 
    
  }
  
  return string ;
}


function resultOfHTML() 
// ��HTML�Ӱ����B�z
{
  var string = "\n" + form1.txtTest.value + "\n" ;
  
  // ���N����Ÿ�
  string = string.replace( /\&/gi, '&amp;' ) ;
  string = string.replace( /\"/gi, '&quot;' ) ;
  string = string.replace( /\'/gi, '&#039;' ) ;
  
  string = string.replace( /\</gi, '&lt;' ) ;
  string = string.replace( /\>/gi, '&gt;' ) ;
  
  // C-style ����
  string = string.replace( /\/\*/gi, '<span class="note">/*' ) ;
  string = string.replace( /\*\//gi, '*/</span>' ) ;
  
  // �[�J�����C�⪺����
  string = string.replace( /\&lt;/gi, '<span class="tag">&lt;' ) ;
  string = string.replace( /\&gt;/gi, '&gt;</span>' ) ;
  
  // ������<!-- & -->
  string = replace( string, '<span class="tag">&lt;!--', '<span class="note">&lt;!--' ) ;
  string = replace( string, '--&gt;</span>', '--&gt;</span>' ) ;
  
  // string = doQuot( string ) ; // �B�z�r�ꪺ����
 
  form1.txtTest2.value = string ; 
}

function resultOfCpp() 
// ��C/C++�Ӱ����B�z
{
  var string = form1.txtTest2.value ;
  var i = 0 ;
  
  // �NHTTP�y�k������<>�Ÿ����ܦ⮳���A�_�h�|�Q�~�{������j�p�Ÿ��A�Ӥް_����
  string = replace( string, '<span class="tag">&lt;', '&lt;' ) ;
  string = replace( string, '&gt;</span>', '&gt;' ) ;
 
  // c/c++�S��function�o������r 
  string = replace( string, 'function ', 'function ' ) ;
                                             
  
  var reservedWord = new Array( 
    // C/C++����r
    // "default ", " continue",  
	" break", " boolean ",  
     "NULL ", "typedef ", 
	 "struct ", "EOF", 
	"using ", "namespace ", 
	"bool ", "string ",
	
	// GTK����
	"guint ", "GtkTextBuffer ", 
	"GtkTextIter ", "GtkTextMark ",
    "GtkClipboard ", "GError ", 
	"gsize ", "GList ", 
	"GdkPixbuf ", "gint ", 
	"GtkTextView ", "AtkAction ", 
	"GtkMenuItem ", "GString ",
	"GtkWidget ", "GdkEventButton ",
    "GtkButton ", "GtkTextTagTable ", 
	"gpointer ", "gboolean "
    
  ) ;
  
   for ( i = 0 ; i < reservedWord.length ; i ++ ) {
    string = replace( string, reservedWord[i], '<span class="reservedWord">' + 
	                                        reservedWord[i] + '</span>' ) ;   
  }
  
    var define = new Array( 
    "#include", "# include", 
	"#define", "# define", 
    "#ifdef", "#endif", "#ifndef",
    "#error", 
    "#elif", "#if",
	
	// C++ include �禡�w
	"&lt;iostream&gt;", "&lt;string&gt;",
	"&lt;vector&gt;", "&lt;deque&gt;",
	"&lt;list&gt;", "&lt;stack&gt;",
	"&lt;priority_queue&gt;", "&lt;set&gt;", 
	"&lt;multiset&gt;", "&lt;map&gt;", 
	"&lt;bitset&gt;", "&lt;complex&gt;", 
	"&lt;iterator&gt;", "&lt;cstring&gt;", 
	"&lt;fstream&gt;", "&lt;cstdio&gt;", 
	"&lt;cstdlib&gt;", "&lt;ctime&gt;", 
	"&lt;sstream&gt;", "&lt;cmath&gt;",
    "&lt;typeinfo&gt;", 	
	
	
	// C include �禡�w
	"&lt;string.h&gt;", "&lt;time.h&gt;", 
	"&lt;stdlib.h&gt;", "&lt;math.h&gt;", 
	"&lt;dos.h&gt;", "&lt;conio.h&gt;", 
	"&lt;stdio.h&gt;", "&lt;io.h&gt;",
	"&lt;graphics.h&gt;", "&lt;windows.h&gt;", 
	"&lt;shlobj.h&gt;", 
	
	// GTK �禡�w
	"&lt;gtk/gtk.h&gt;", "&lt;sys/types.h&gt;",
	"&lt;glib.h&gt;", "&lt;sys/stat.h&gt;",
	"&lt;config.h&gt;", "&lt;unistd.h&gt;",
	
    // Qt�禡�w
    "&lt;QApplication&gt;", "&lt;QBitmap&gt;",
    "&lt;QLabel&gt;", "&lt;QPushButton&gt;",
    "&lt;QVBoxLayout&gt;", "&lt;QHBoxLayout&gt;",
    "&lt;QString&gt;", "&lt;QFileDialog&gt;",
    "&lt;QWidget&gt;", "&lt;QFont&gt;",
    "&lt;QFrame&gt;", "&lt;QObject&gt;",
    "&lt;QPoint&gt;", "&lt;QPicture&gt;",
    "&lt;QPrinter&gt;", "&lt;QProcess&gt;",
    "&lt;QFtp&gt;", "&lt;QFontInfo&gt;"
    
  ) ;
  
    for ( i = 0 ; i < define.length ; i ++ ) {
    string = replace( string, define[i], '<span class="define">' + 
	                                 define[i] + '</span>' ) ;   
  }

  form1.txtTest2.value = string ; 
}

function resultOfJavaScript() 
// ��javascript�Ӱ����B�z
{
  
  var string = form1.txtTest2.value ;
  var i = 0 ;
  
  // 2010.5.8 :�]���s����Opera�M��hrome�|�۰��_��A
  // ����overflow:auto��white-space:pre���L�ġA<pre>�]�L�ΪZ���a�A
  // �ҥH�u�n�Φ��k�A�C�@�泣�[�W<br>�A�f�twhite-space:nowrap�ϥΡC
  // string=replace(  string, '\n',  '\n' ) ;
  
  // ����HTML���`��
  string = string.replace( /\<span class="note">&lt;!--      /gi, '&lt;!--' ) ;
  
  //�@����<<������
  string = replace( string, '<span class="tag">&lt;<span class="tag">&lt;', "&lt;&lt;" ) ;
  string = replace( string, '&gt;</span>&gt;</span>', "&gt;&gt;" ) ;
  
  //  �����ΨӤ���j�p��<,>������ (�u��B�z���Ů檺�B��Ÿ�<, >
  string = replace( string, '<span class="tag">&lt; ', "&lt; " ) ;
  string = replace( string, ' &gt;</span>', " &gt;" ) ;
  
  // javascript�Ҧ����O�d�r
  var reservedWord = new Array( 
      "case ", "catch ", 
	  "gchar ", "char ", 
	  "class ", "continue ", 
	  "const", "debugger ", 
	  "default ", "delete ", 
	  "do ", "double ", 
	  "else", "enum", 
	  "export", "extends ", 
	  "false ", "final ", 
	  "finally ", "float ", 
	  "float ", " for ", 
	  "function ", "goto ", 
	  " if ", "implements ",
      "uint ",  
	  "int ", "interface ", 
	  "long ", "native ", 
	  "new ", "package ", 
	  "null ", "private ", 
	  "super ", "public ", 
	  "protected ",  "return ", "return;", 
	  "static ", "short ", 
	  "switch ", "synchronized ", 
	  " this ", "throws ", 
	  "transient ", "throw ", 
	  " true ", " try ", 
	  "typeof ", "var ", 
	  "void ", "void\n", "volatile ", 
	  "while ", "with "  ) ;
	

   // �[�J�O�d�r���C����� 
  for ( i = 0 ; i < reservedWord.length ; i ++ ) {
    string = replace( string, reservedWord[i], '<span class="reservedWord">' + 
	                                        reservedWord[i] + '</span>' ) ;   
  }
  
  // point�᭱��int�|�Q�ܦ�A�o�䰵�ץ�
  string = replace( string, 'po<span class="reservedWord">int </span>',  'point ' ) ;
  // entry�᭱��try�|�Q�ܦ�A�o�䰵�ץ�
  string = replace( string, 'en<span class="reservedWord">try </span>',  'entry  ' ) ;
  // undo�᭱��do�|�Q�ܦ�A�o�䰵�ץ�
  string = replace( string, 'un<span class="reservedWord">do </span>',  'undo  ' ) ;
  // _new�᭱��new�|�Q�ܦ�A�o�䰵�ץ�
  string = replace( string, '_<span class="reservedWord">new </span>',  '_new ' ) ;
  // guint�᭱��int�|�Q�ܦ�A�o�䰵�ץ�
  string = replace( string, 'gu<span class="reservedWord">int </span>',  'guint ' ) ;
                                            
  
  string = doQuot( string ) ; // �B�z�r�ꪺ����
  
  string = replace( string, '<span class="quot">&quot;&<b></b>quot;</span>', '<span class="quot">&quot;<b></b>&quot;</span>' ) ;
  
  // �ѨM�P�A���s�b�@�_��bug (PS:�k��r���n�Ψ��\\�A�����D������A�`�ڧˤF�ܤ[�@....)
  string = replace( string, 'if\\(', '<span class="reservedWord">if</span> \(' ) ;    
  string = replace( string, 'else\\(', '<span class="reservedWord">else</span> \(' ) ; 
  string = replace( string, 'while\\(', '<span class="reservedWord">while</span> \(' ) ; 
  string = replace( string, 'for\\(', '<span class="reservedWord">for</span> \(' ) ; 
  string = replace( string, 'switch\\(', '<span class="reservedWord">switch</span> \(' ) ; 
  
  // �ѨMbreak;
  string = replace( string, 'break;', '<span class="reservedWord">break;</span>' ) ;   
  
  

  string = doNote( string ) ; // �[�J���ѲŸ����C��
   
  form1.txtTest2.value = string ; 
}