$(document).ready(function() {
    // =============================================
    // NAVIGATION AND SCROLLING FUNCTIONALITY
    // =============================================
    
    // Update navbar style on scroll
    function updateNavbar() {
        if ($(window).scrollTop() > 100) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    }

    // Update active menu item based on scroll position
    function updateActiveMenu() {
        const scrollPosition = $(window).scrollTop();
        const navbarHeight = $('.navbar').outerHeight();
        const offset = navbarHeight + 20;
        
        $('section').each(function() {
            const sectionTop = $(this).offset().top - offset;
            const sectionBottom = sectionTop + $(this).outerHeight();
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const sectionId = $(this).attr('id');
                $('.navbar-nav .nav-link').removeClass('active');
                $(`.navbar-nav a[href="#${sectionId}"]`).addClass('active');
            }
        });
    }

    // Initialize navbar and active menu
    updateNavbar();
    updateActiveMenu();

    // Handle scroll events
    $(window).scroll(function() {
        updateNavbar();
        updateActiveMenu();
        
        // Back to top button visibility
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').addClass('active');
        } else {
            $('.back-to-top').removeClass('active');
        }
    });

    // Smooth scrolling for all navigation links
    $(document).on('click', '.navbar-nav a[href^="#"]', function(e) {
        e.preventDefault();
        const target = $($(this).attr('href'));
        
        if (target.length) {
            const navbarHeight = $('.navbar').outerHeight();
            const scrollTo = target.offset().top - navbarHeight - 20;
            
            $('html, body').stop().animate({
                scrollTop: scrollTo
            }, 800, 'easeInOutQuad', function() {
                window.history.pushState(null, null, $(e.target).attr('href'));
            });
        }
    });

    // Back to top button
    $('.back-to-top').click(function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 1000);
    });

    // =============================================
    // HOUSE PLANNER FUNCTIONALITY (UNCHANGED)
    // =============================================
    
    let currentStep = 1;
    const totalSteps = 3;
    
    // Style selection
    $('.style-option').click(function() {
        $('.style-option').removeClass('active');
        $(this).addClass('active');
        const style = $(this).data('style');
        $('#preview-style').text(style.charAt(0).toUpperCase() + style.slice(1));
        
        // Change preview image based on style
        let newImage;
        switch(style) {
            case 'modern':
                newImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';
                break;
            case 'traditional':
                newImage = 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';
                break;
            case 'indian':
                newImage = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80';
                break;
        }
        
        $('#preview-image').fadeOut(300, function() {
            $(this).attr('src', newImage).fadeIn(300);
        });
    });
    
    // Square feet slider
    $('#square-feet').on('input', function() {
        const value = $(this).val();
        $('#square-feet-value').text(value + ' sq ft');
        $('#preview-size').text(value + ' sq ft');
    });
    
    // Floors, bedrooms and bathrooms selection
    $('#floors, #bedrooms, #bathrooms').change(function() {
        const floors = $('#floors').val();
        const bedrooms = $('#bedrooms').val();
        const bathrooms = $('#bathrooms').val();
        $('#preview-rooms').text(bedrooms + ' Bed, ' + bathrooms + ' Bath');
        $('#preview-floors').text(floors);
    });
    
    // Navigation between steps
    $('.next-step').click(function() {
        if (currentStep < totalSteps) {
            $('.step').eq(currentStep - 1).removeClass('active').addClass('completed');
            $('.step').eq(currentStep).addClass('active');
            currentStep++;
            
            // Update navigation buttons
            $('.prev-step').prop('disabled', false);
            if (currentStep === totalSteps) {
                $('.next-step').text('Finish');
            }
            
            // Smooth scroll to next step
            $('html, body').animate({
                scrollTop: $('.step.active').offset().top - 100
            }, 500);
        } else {
            // Finish the planner
            const selectedStyle = $('.style-option.active').data('style');
            const size = $('#square-feet').val();
            const floors = $('#floors').val();
            const bedrooms = $('#bedrooms').val();
            const bathrooms = $('#bathrooms').val();
            
            // Get selected features
            const features = [];
            $('.feature-selection input:checked').each(function() {
                features.push($(this).next('label').text());
            });
            
            alert(`Your ${selectedStyle} style house plan (${size} sq ft, ${floors} floors, ${bedrooms} bedrooms, ${bathrooms} bathrooms) with features: ${features.join(', ')} has been generated! We will contact you with more details.`);
            
            resetPlanner();
        }
    });
    
    $('.prev-step').click(function() {
        if (currentStep > 1) {
            $('.step').eq(currentStep - 1).removeClass('active');
            $('.step').eq(currentStep - 2).addClass('active').removeClass('completed');
            currentStep--;
            
            // Update navigation buttons
            if (currentStep === 1) {
                $('.prev-step').prop('disabled', true);
            }
            $('.next-step').text('Next');
            
            // Smooth scroll to previous step
            $('html, body').animate({
                scrollTop: $('.step.active').offset().top - 100
            }, 500);
        }
    });
    
    // Generate full plan button
    $('.generate-plan').click(function() {
        const selectedStyle = $('.style-option.active').data('style');
        const size = $('#square-feet').val();
        const floors = $('#floors').val();
        const bedrooms = $('#bedrooms').val();
        const bathrooms = $('#bathrooms').val();
        
        // Get selected features
        const features = [];
        $('.feature-selection input:checked').each(function() {
            features.push($(this).next('label').text());
        });
        
        alert(`Your detailed ${selectedStyle} style house plan (${size} sq ft, ${floors} floors, ${bedrooms} bedrooms, ${bathrooms} bathrooms) with features: ${features.join(', ')} is being generated! Check your email for the complete plan.`);
        
        resetPlanner();
    });
    
    function resetPlanner() {
        $('.step').removeClass('active completed');
        $('.step').first().addClass('active');
        currentStep = 1;
        $('.prev-step').prop('disabled', true);
        $('.next-step').text('Next');
        
        // Reset form elements
        $('.style-option').first().addClass('active').siblings().removeClass('active');
        $('#square-feet').val(1500).trigger('input');
        $('#floors').val(2);
        $('#bedrooms').val(3);
        $('#bathrooms').val(2);
        $('.feature-selection input').prop('checked', false);
        $('#garage, #patio').prop('checked', true);
        
        // Reset preview
        $('#preview-image').attr('src', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
        $('#preview-style').text('Modern');
        $('#preview-size').text('1500 sq ft');
        $('#preview-rooms').text('3 Bed, 2 Bath');
        $('#preview-floors').text('2');
    }
    
    // Initialize first style as active
    $('.style-option').first().addClass('active');
    
    // =============================================
    // GALLERY FUNCTIONALITY (UNCHANGED)
    // =============================================
    
    // View More Designs button functionality
    // $('#view-more-btn').click(function(e) {
    //     e.preventDefault();
        
    //     if ($('.more-gallery').is(':visible')) {
    //         $('.more-gallery').slideUp();
    //         $(this).text('View More Designs');
    //         $('html, body').animate({
    //             scrollTop: $('#gallery').offset().top - 100
    //         }, 500);
    //     } else {
    //         // Load additional gallery items only once
    //         if ($('.more-gallery').children().length === 0) {
    //             const moreGalleryItems = [
    //                 {
    //                     img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
    //                     title: 'Modern Indian Villa',
    //                     category: 'indian'
    //                 },
    //                 {
    //                     img: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    //                     title: 'European Cottage',
    //                     category: 'foreign'
    //                 },
    //                 {
    //                     img: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
    //                     title: 'South Indian Traditional',
    //                     category: 'indian'
    //                 },
    //                 {
    //                     img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    //                     title: 'Contemporary Design',
    //                     category: 'foreign'
    //                 },
    //                 {
    //                     img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
    //                     title: 'Rajputana Haveli',
    //                     category: 'indian'
    //                 },
    //                 {
    //                     img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    //                     title: 'Modern Luxury',
    //                     category: 'foreign'
    //                 }
    //             ];
                
    //             moreGalleryItems.forEach(item => {
    //                 $('.more-gallery').append(`
    //                     <div class="col-md-4">
    //                         <div class="gallery-item">
    //                             <img src="${item.img}" alt="${item.title}" class="img-fluid">
    //                             <div class="gallery-overlay">
    //                                 <h5>${item.title}</h5>
    //                                 <span class="badge ${item.category === 'indian' ? 'bg-warning' : 'bg-info'}">${item.category === 'indian' ? 'Indian' : 'Foreign'}</span>
    //                                 <a href="#" class="btn btn-sm btn-outline-light mt-2">View Details</a>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 `);
    //             });
    //         }
            
    //         $('.more-gallery').slideDown();
    //         $(this).text('Show Less');
    //     }
    // });
    
    // =============================================
    // CONTACT FORM FUNCTIONALITY (UNCHANGED)
    // =============================================
    
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        const name = $('#name').val();
        const email = $('#email').val();
        const subject = $('#subject').val();
        const message = $('#message').val();
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Here you would typically send the form data to a server
        // For now, we'll just show a success message
        alert(`Thank you, ${name}! Your message has been sent. We will contact you soon at ${email}.`);
        this.reset();
    });
    
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    
    // Gallery hover effect for touch devices
    if ('ontouchstart' in window) {
        $('.gallery-item').click(function() {
            $(this).toggleClass('hover');
        });
    }
});