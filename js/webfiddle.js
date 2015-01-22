// Will hold output file data
var outputFile = null;
var cssEditor, htmlEditor, jsEditor;

$(function(){
    // Initialize Editors
    initEditors();

    // Adjust views and editor sizes
    resizeViews();
    $(window).resize(resizeViews);

    // Bind click handlers for top link/buttons
    $(".viewBtn").click(viewBtnClick);
    $("#outputLink").click(outputLinkClick);

    // Give focus to the HTML editor
    htmlEditor.focus();
});

/**
 * Generates Preview of Inputted Code
 * Saves inputted code into localStorage
 * Reloads iframe which reads from localStorage
 * and document.writes() to give preview
 */
function generatePreview(){
    prepareContent();
    var iframe = $("#preview");
    iframe.attr('src', iframe.attr('src'));
}

/**
 * Initialize ACE Editors
 * For more options like modes, themes, etc.
 * visit http://ace.c9.io/
 */
function initEditors(){
    // HTML Editor
    htmlEditor = ace.edit("editor-html"); // Set container html element
    htmlEditor.setTheme("ace/theme/vibrant_ink"); // Set Highlighting Theme
    htmlEditor.getSession().setMode("ace/mode/html"); // Set Mode

// JS Editor
    jsEditor = ace.edit("editor-js");
    jsEditor.setTheme("ace/theme/vibrant_ink");
    jsEditor.getSession().setMode("ace/mode/javascript");

// CSS Editor
    cssEditor = ace.edit("editor-css");
    cssEditor.setTheme("ace/theme/vibrant_ink");
    cssEditor.getSession().setMode("ace/mode/css");
}

/**
 * Create Object URL for Downloading Output
 * This takes the output of the 3 editors and
 * creates a object URL for download.
 * @param output
 * @returns objectURL
 */
function makeOutputFile(output){
    var data = new Blob([output], {type: 'text/html'});

    // Kill last, and generate new object URL
    window.URL.revokeObjectURL(outputFile);
    outputFile = window.URL.createObjectURL(data);

    return outputFile;
}
/**
 * Creates a the HTML for the output page.
 * Spaces are intentional in the strings for spacing in output.
 * @returns {string} page   Contains the the HTML for the output page.
 */
function makePage(){
    var page = "<!DOCTYPE html>\n<html>\n    <head>\n        ";
        page += localStorage.getItem("css");
        page += "\n    <\/head>\n    <body>\n        ";
        page += localStorage.getItem("html");
        page += "\n        <script src=\"http://code.jquery.com/jquery-1.11.2.min.js\"></script>\n        ";
        page += localStorage.getItem("js");
        page += "\n    <\/body>\n<\/html>";
    return page;
}

/**
 * Handles the "Save Output" link
 */
function outputLinkClick(){
    prepareContent();
    var content = makePage();
    $(this).attr("href", makeOutputFile(content));
}

/**
 * Wraps Inputted Code and saves it to localStorage
 * @returns string CSS wrapped in <style> tag + HTML + JS wrapped in <script> tag
 */
function prepareContent(){
    var css = "<style>\n" + cssEditor.getValue() + "\n</style>";
    var html = htmlEditor.getValue();
    var js = "<script>\n" + jsEditor.getValue() + "\n<\/script>";
    localStorage.setItem("css", css);
    localStorage.setItem("html", html);
    localStorage.setItem("js", js);
}

/**
 * Resize views
 */
function resizeViews(){
    var height = $(window).height()-38; // 38 To adjust for top blue bar
    $(".editor").height(height);
    $("iframe").height(height);
}

/**
 * Handles the Editor Buttons
 */
function viewBtnClick(){
    // Set the clicked button to active (not the others)
    $(".viewBtn").removeClass("active");
    $(this).addClass("active");

    // Hide all views
    $(".view").hide();

    // Find out what view was requested
    var view = $(this).attr("data-value");

    // If it was preview then generate output for preview
    if (view == "preview") generatePreview();

    // Show request view
    $(".view[data-value='" + view + "']").show();

    // Give focus to the editor
    window[view + "Editor"].focus();
}