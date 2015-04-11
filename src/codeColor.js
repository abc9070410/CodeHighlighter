
window.onload = init;

function init()
{
    document.getElementById("transferButton").addEventListener("click", checkLanguage, false);
}


function replace( string, oldSubStr, newSubStr )
// string字串中凡符合oldSubStr的，全換成newSubStr
{
  return string.replace( new RegExp( oldSubStr,"gm"), newSubStr ) ;
}

function getTextareaRow()
// 取得textarea目前的行數
{
  i = form1.txtTest.value.match(/\n/g) ; 
  
  var txtlen = 1 ;
  
  if ( i )
    txtlen = i.length + 1 ; 
	
  return txtlen ;
}

function getLineHTMLCode()
// 取得行數的html碼
{
  var n = getTextareaRow() ;
  var str = "" ;
  
  for ( i = 1 ; i < n+1 ; i ++ )
    str += "" + i + "\n" ;

  return str ;
}

function getHTMLCode() 
// 取得最後的程式碼，可以直接貼在網頁上
{
  var str = "" ;
  /* // table格式，取代float，有固定格式的優點，但會因為scroll出現與否而改變行號的高度，需要另外修改。
  str = '<!--程式碼開始--><div><table><tr><td><pre class=\"codeStyle\" style=\"width:30px; height:auto; background-color:lightslategray; color:white ; TEXT-ALIGN:center \">'
       + getLineHTMLCode() 
	   + '</pre></td><td>' 
       + '<pre class=\"codeStyle\" style=\"width:540px \">' 
	   + form1.txtTest2.value 
	   + '</pre></td></tr></table></div><!--程式碼結束-->' ;
*/
    str = '<!--程式碼開始--><pre class=\"codeStyle\" style=\"float:left; width:30px; height:auto; background-color:lightslategray; color:white ; TEXT-ALIGN:center; \">'
       + getLineHTMLCode() 
	   + '</pre>' 
       + '<pre class=\"codeStyle\" style=\"float:left; width:540px; \">' 
	   + form1.txtTest2.value 
	   + '</pre><!--程式碼結束-->' ;
	   
  return str ;	   
}

function checkLanguage() 
// 框選哪些語言，就做哪些語言的檢查
{
  var string = form1.txtTest.value ;
  var shouldTranslate = true ;
  var oTextCount = document.getElementById("txtCount2") ; // 包裝成物件
  
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
    form1.txtTest2.value = getHTMLCode() ; // 改變網頁上txtCount的值
    oTextCount.innerHTML = form1.txtTest2.value ; // 改變網頁上txtCount的值
  }
  shouldTranslate = true ;
}

function deleteString( string, deleteString )
// 將string中符合deleteString的字串全部刪除
{
  return string.replace( new RegExp(deleteString,"gm"),"" ) ; 
}

function replaceString( string, oldString, newString )
// 將string中符合oldString的字串全部替換成newString
{
  return string.replace( new RegExp(oldString,"gm"), newString ) ; 
}

function substr( string, start, end )
// 取代內建的substr
{
  var str = "" ;
  
  for ( i = start ; i < end ; i ++ ) {
    str += string.charAt( i ) ;
  }
  return str ;
}

function deleteTag( string, start, end )
// 把範圍內所有的標籤清除乾淨
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
// 把範圍內所有的符合字串全部替換
{
  var stringSub = substr( string, start, end ) ;
  //var stringSub =  string.substr( start, end ) ;
  var oldStringSub = stringSub ;

  stringSub = replaceString( stringSub, oldString, newString ) ;

  return string.replace( oldStringSub, stringSub ) ;
}

function doNoteOLD( string ) 
// 檢查程式碼中有無 "//" 注解符號，若有，便做若干處理
{
  
  var over = false ;
  var now = 0 ; 
  var now2 = 0 ;
  var nowOld = 0 ;
  var count = 0 ;
  var timeOut = 0 ;
  var stringSub = "" ;
  var stringSub2 = "" ;
  var str = "" ;  // 用來處理註解裡面的標籤
  var str2 = "" ; // 用來處理註解裡面的標籤
  
  // 修正sites會轉為註解的bug
  string = replace( string, '://', ':/<b></b>/' ) ;
  
  // 修正消去符號意義後的bug
  // string = replace( string, '//', '\/<b></b>/' ) ;
  
  for ( i=0 ; !over ; i = now2 + 1 ) {
    now = string.indexOf( "//" ,now ) ;
	nowOld = now ;
	
	if ( now == -1 || timeOut > 50 )
	  over = true ;
	else {
	  stringSub = string.substr( now, 20 ) ; // 太少字元會因為跟別的字串重疊而發生誤判
	  stringSub2 = stringSub ;
	  
	  string = string.replace( stringSub2, '<span class="note">' + stringSub ) ; // 只換第一個
	  now = now + 8 ; // 因為多了<note>//這八個字元
	  
	  stringSub = string.substr( now, 400 ) ; // 因為只找第一個，所以範圍放多大都沒關係
	  stringSub2 = stringSub ;
	  
	  now2 = string.indexOf( "\n", now ) ;
	  
	  string = deleteTag( string, now, now2 ) ; // 把註解中的其他顏色標籤全拿掉
	  
	  stringSub = string.substr( now, 400 ) ;
	  stringSub2 = stringSub ;
	  stringSub = stringSub.replace( "\n", "</span> \n" ) ; // 只換第一個(放在deleteTag後面是怕被砍掉</span>
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
// 處理字串的細節部分
{
  var over = false ;
  var i, start = 0, end = 0, tempLength ;
  var tempStr = "", tempStr2 = "" ;  
  var oldStringLength = 0, newStringLength = 0 ;
  var oldSubStr = "", newSubStr = "" ;
  
  // 往下一個個找，直到找不到為止（找不到-> start=-1 ）
  for ( i = 0 ; end > -1 ; i = end + 1 ) {  
    start = string.indexOf( quotStr, i ) ; // 取得第一個”號位置
	
	if ( string.substr( start+quotStr.length, 3 ) == '/gi' )
		start = string.indexOf( quotStr, start+4 ) ; // 這次不算，重新取得第一個”號位置
	
    if ( start > 0 ) {
      end = string.indexOf( quotStr, start + 1 ) ; // 找第二個”號位置
      if ( end-start > 260 )
        end = start + 260 ; // 小部分解決長篇程式碼會造成一些註解變成/<b></B
    }
    else
      end = -1 ;
	  
    if ( start > 0 && end > 0 ) { // 有找到以""包覆的字串
	
	  // 從start開始，取『end-start + quotStr.length』長度的字串
      tempStr = string.substr( start, end-start + quotStr.length ) ;  
      //alert( "tempStr = " + tempStr ) ;
      
	  //alert( tempStr + "      \n[" + string +  "]" ) ;
      string = string.replace( tempStr, '<span class="quot">' + tempStr + '</span>' ) ;
				  
	  // 避免發生第一個字元為<的狀況（會發生錯誤）	
	  if ( string.substr( start + 19 + quotStr.length, 1 ) != '<' &&
          string.substr( start + 19 + quotStr.length, 1 ) != '&'	  ) {
		// <span class="quot">的長度為19
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
	  
	  // 7: <b></b>的長度
      string = deleteTag( string, start + 19, end + 19 + 7 ) ;

      newStringLength = string.length ;
      
      tempLength = subLength( oldStringLength, newStringLength ) ;
 
      string = replaceSubStr( string, '//', '/<b></b>/', start, end + 26 - tempLength ) ;

      newStringLength = string.length ;
      
	  // '<span class="quot">' + '</span>'的長度 = 26
      end += 26 + 7 - subLength( oldStringLength, newStringLength ) ; 
    
    } 
    
  }
      
  return string ;
}

function doQuot( string ) 
// 處理字串
{
  string = doQuotIn( string, '&quot;' ) ; // 先處理””
  string = doQuotIn( string, '&#039;' ) ; // 再處理’’
  return string ;
}

function doNote( string )
{
  // 修正sites會轉為註解的bug
  string = replace( string, '://', ':/<b></b>/' ) ;
  
  string = doNoteIn( string, '//' ) ;
  
  return string ;

}

function doNoteIn( string, noteStr )
// 處理註解的細節部分
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
    alert( "noteStr Error : " + noteStr ) ; // 出錯即跳出警告視窗
  
  for ( i = 0 ; end > -1 ; i = end + 1 ) {
    start = string.indexOf( noteStr, i ) ;
	
    if ( start > 0 )
      end = string.indexOf( noteEndStr, start + 1 ) ;
    else
      end = -1 ;
	  
    if ( start > 0 && end > 0 ) { // 有找到註解內的字串
      tempStr = string.substr( start, end - start + noteStr.length - 1 ) ; 
      
      string = string.replace( tempStr, '<span class="note">' + tempStr + '</span>' ) ;
      
      stringOldLength = string.length ;
      
	  //alert( string.substr( start+19, end-start+1 ) ) ;
      string = deleteTag( string, start+19, end+19 ) ; // 把註解中的其他顏色標籤全拿掉
      
      tempStr2 = string.substr( start + 19, noteStr.length + 1 ) +
                 '<B></B>' +
                 string.substr( start + 19 + noteStr.length + 1 , tempStr.length - 3 ) ; 
				 
      //alert( tempStr2 ) ;
      string = string.replace( tempStr, tempStr2 ) ;
      
      stringNewLength = string.length ;
      
	  // '<span class="quot">' + '</span>'的長度 = 26
      end += 26 - ( stringOldLength - stringNewLength ) ; 
    } 
    
  }
  
  return string ;
}


function resultOfHTML() 
// 做HTML該做的處理
{
  var string = "\n" + form1.txtTest.value + "\n" ;
  
  // 取代跳脫符號
  string = string.replace( /\&/gi, '&amp;' ) ;
  string = string.replace( /\"/gi, '&quot;' ) ;
  string = string.replace( /\'/gi, '&#039;' ) ;
  
  string = string.replace( /\</gi, '&lt;' ) ;
  string = string.replace( /\>/gi, '&gt;' ) ;
  
  // C-style 註解
  string = string.replace( /\/\*/gi, '<span class="note">/*' ) ;
  string = string.replace( /\*\//gi, '*/</span>' ) ;
  
  // 加入改變顏色的標籤
  string = string.replace( /\&lt;/gi, '<span class="tag">&lt;' ) ;
  string = string.replace( /\&gt;/gi, '&gt;</span>' ) ;
  
  // 替換掉<!-- & -->
  string = replace( string, '<span class="tag">&lt;!--', '<span class="note">&lt;!--' ) ;
  string = replace( string, '--&gt;</span>', '--&gt;</span>' ) ;
  
  // string = doQuot( string ) ; // 處理字串的部分
 
  form1.txtTest2.value = string ; 
}

function resultOfCpp() 
// 做C/C++該做的處理
{
  var string = form1.txtTest2.value ;
  var i = 0 ;
  
  // 將HTTP語法的標籤<>符號的變色拿掉，否則會被誤認為比較大小符號，而引起錯亂
  string = replace( string, '<span class="tag">&lt;', '&lt;' ) ;
  string = replace( string, '&gt;</span>', '&gt;' ) ;
 
  // c/c++沒有function這個關鍵字 
  string = replace( string, 'function ', 'function ' ) ;
                                             
  
  var reservedWord = new Array( 
    // C/C++關鍵字
    // "default ", " continue",  
	" break", " boolean ",  
     "NULL ", "typedef ", 
	 "struct ", "EOF", 
	"using ", "namespace ", 
	"bool ", "string ",
	
	// GTK相關
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
	
	// C++ include 函式庫
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
	
	
	// C include 函式庫
	"&lt;string.h&gt;", "&lt;time.h&gt;", 
	"&lt;stdlib.h&gt;", "&lt;math.h&gt;", 
	"&lt;dos.h&gt;", "&lt;conio.h&gt;", 
	"&lt;stdio.h&gt;", "&lt;io.h&gt;",
	"&lt;graphics.h&gt;", "&lt;windows.h&gt;", 
	"&lt;shlobj.h&gt;", 
	
	// GTK 函式庫
	"&lt;gtk/gtk.h&gt;", "&lt;sys/types.h&gt;",
	"&lt;glib.h&gt;", "&lt;sys/stat.h&gt;",
	"&lt;config.h&gt;", "&lt;unistd.h&gt;",
	
    // Qt函式庫
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
// 做javascript該做的處理
{
  
  var string = form1.txtTest2.value ;
  var i = 0 ;
  
  // 2010.5.8 :因應新版的Opera和Ｃhrome會自動斷行，
  // 不管overflow:auto或white-space:pre都無效，<pre>也無用武之地，
  // 所以只好用此法，每一行都加上<br>，搭配white-space:nowrap使用。
  // string=replace(  string, '\n',  '\n' ) ;
  
  // 拿掉HTML的注解
  string = string.replace( /\<span class="note">&lt;!--      /gi, '&lt;!--' ) ;
  
  //　拿掉<<的標籤
  string = replace( string, '<span class="tag">&lt;<span class="tag">&lt;', "&lt;&lt;" ) ;
  string = replace( string, '&gt;</span>&gt;</span>', "&gt;&gt;" ) ;
  
  //  拿掉用來比較大小的<,>的標籤 (只能處理有空格的運算符號<, >
  string = replace( string, '<span class="tag">&lt; ', "&lt; " ) ;
  string = replace( string, ' &gt;</span>', " &gt;" ) ;
  
  // javascript所有的保留字
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
	

   // 加入保留字的顏色標籤 
  for ( i = 0 ; i < reservedWord.length ; i ++ ) {
    string = replace( string, reservedWord[i], '<span class="reservedWord">' + 
	                                        reservedWord[i] + '</span>' ) ;   
  }
  
  // point後面的int會被變色，這邊做修正
  string = replace( string, 'po<span class="reservedWord">int </span>',  'point ' ) ;
  // entry後面的try會被變色，這邊做修正
  string = replace( string, 'en<span class="reservedWord">try </span>',  'entry  ' ) ;
  // undo後面的do會被變色，這邊做修正
  string = replace( string, 'un<span class="reservedWord">do </span>',  'undo  ' ) ;
  // _new後面的new會被變色，這邊做修正
  string = replace( string, '_<span class="reservedWord">new </span>',  '_new ' ) ;
  // guint後面的int會被變色，這邊做修正
  string = replace( string, 'gu<span class="reservedWord">int </span>',  'guint ' ) ;
                                            
  
  string = doQuot( string ) ; // 處理字串的部分
  
  string = replace( string, '<span class="quot">&quot;&<b></b>quot;</span>', '<span class="quot">&quot;<b></b>&quot;</span>' ) ;
  
  // 解決與括號連在一起的bug (PS:逃脫字元要用兩個\\，不知道為什麼，害我弄了很久　....)
  string = replace( string, 'if\\(', '<span class="reservedWord">if</span> \(' ) ;    
  string = replace( string, 'else\\(', '<span class="reservedWord">else</span> \(' ) ; 
  string = replace( string, 'while\\(', '<span class="reservedWord">while</span> \(' ) ; 
  string = replace( string, 'for\\(', '<span class="reservedWord">for</span> \(' ) ; 
  string = replace( string, 'switch\\(', '<span class="reservedWord">switch</span> \(' ) ; 
  
  // 解決break;
  string = replace( string, 'break;', '<span class="reservedWord">break;</span>' ) ;   
  
  

  string = doNote( string ) ; // 加入註解符號的顏色
   
  form1.txtTest2.value = string ; 
}