module AceSkin
  module AceForm
    autoload :Form,                         'ace_skin/ace_form/form'
    autoload :Element,                      'ace_skin/ace_form/element'

    module Elements
      # autoload :Elements,                  'ace_skin/ace_form/elements'
      autoload :Base,                      'ace_skin/ace_form/elements/base'
      autoload :Hidden,                    'ace_skin/ace_form/elements/hidden'
      autoload :Boolean,                   'ace_skin/ace_form/elements/boolean'
      autoload :Date,                      'ace_skin/ace_form/elements/date'
      autoload :Float,                     'ace_skin/ace_form/elements/float'
      autoload :Integer,                   'ace_skin/ace_form/elements/integer'
      autoload :Text,                      'ace_skin/ace_form/elements/text'
      autoload :Time,                      'ace_skin/ace_form/elements/time'
      autoload :Radio,                     'ace_skin/ace_form/elements/radio'
      autoload :CheckBox,                  'ace_skin/ace_form/elements/checkbox'
      autoload :Choose,                    'ace_skin/ace_form/elements/choose'
      autoload :MultipleChoose,            'ace_skin/ace_form/elements/multiple_choose'
      autoload :Calculate,                 'ace_skin/ace_form/elements/calculate'
      autoload :Photo,                     'ace_skin/ace_form/elements/photo'
      autoload :ShopSelect,                'ace_skin/ace_form/elements/shop_select'
      autoload :Position,                  'ace_skin/ace_form/elements/position'
      autoload :Audio,                     'ace_skin/ace_form/elements/audio'
      autoload :RichText,                  'ace_skin/ace_form/elements/rich_text'
    end
  end
end