

const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'publications', 'teaching']


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        const url = content_dir + name + '.md'
        console.log(`Fetching content for section: ${name} -> ${url}`)
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status} fetching ${url}`)
                return response.text()
            })
            .then(markdown => {
                console.log(`Loaded ${name}.md (${markdown.length} chars)`)
                const html = marked.parse(markdown);
                const el = document.getElementById(name + '-md')
                if (!el) throw new Error(`Missing element: ${name}-md`)
                el.innerHTML = html;
            }).then(() => {
                // MathJax
                if (window.MathJax && MathJax.typeset) MathJax.typeset();
            })
            .catch(error => console.log(`Error loading section ${name}:`, error));
    })

}); 
