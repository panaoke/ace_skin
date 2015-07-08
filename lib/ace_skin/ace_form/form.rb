module AceSkin
  class AceForm::Form
    attr_accessor :options

    def initialize(options)
      @options = options.dup.symbolize_keys
    end

    [:code, :template, :html].each do |name|
      define_method name do
        options[name]
      end
    end

    def html
      (options[:html] || {}).update(common_html)
    end

    def dom_id
      options[:html].try{|html| html[:id]} || code
    end

    def common_html
      {method: options[:method] || 'post' , 'accept-charset' => "UTF-8", id: dom_id, class: dom_class}
    end

    def dom_class
      options[:html].try{|h| h[:class]}.blank? ? 'ace-form' : (options[:html][:class] << ' ace-form')
    end

    def template
      @template || 'default'
    end

  end
end
